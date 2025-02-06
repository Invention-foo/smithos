import { supabase } from "./supabase";

const evaluateSecurityRisks = (results: any) => {
  let message = "";
  
  // Check high risk conditions first
  const highRiskConditions = {
    'is_honeypot': ['1', "HIGH RISK - Honeypot detected.\n"],
    'is_proxy': ['1', "HIGH RISK - Proxy contract detected.\n"], 
    'hidden_owner': ['1', "HIGH RISK - Hidden owner detected.\n"],
    'fake_token': [(x: string) => x !== '', "Fake token detected.\n"],
    'can_take_back_ownership': ['1', "HIGH RISK - Ownership can be reclaimed. This is likely for malicious reasons.\n"]
  };

  for (const [key, [value, msg]] of Object.entries(highRiskConditions)) {
    if (!results || !(key in results)) continue;
    if (typeof value === 'function' ? value(results[key]) : results[key] === value) {
      message += msg;
      return { status: "red", message };
    }
  }

  // Check medium risk conditions
  const mediumRiskConditions = {
    'is_airdrop_scam': ['1', "Airdrop scam detected.\n"],
    'is_blacklisted': ['1', "Addresses can be blacklisted. Make sure ownership is renounced.\n"],
    'anti_whale_modifiable': ['1', "Anti whale modifiable. Make sure ownership is renounced.\n"],
    'is_anti_whale': ['1', "Anti whale. While this could be used legitimately, make sure this is not abused.\n"],
    'cannot_sell_all': ['1', "Limit on the holder selling all tokens. Make sure this is not abused.\n"],
    'transfer_pausable': ['1', "Transfers can be paused. Make sure ownership is renounced.\n"],
    'trading_cooldown': ['1', "Trading cooldown can be abused. Make sure ownership is renounced.\n"],
    'slippage_modifiable': ['1', "Tax can be modified, making the token unsellable. Make sure ownership is renounced.\n"],
    'personal_slippage_modifiable': ['1', "Tax can be modified for individual wallets. Make sure this is not abused.\n"]
  };

  for (const [key, [value, msg]] of Object.entries(mediumRiskConditions)) {
    if (!results || !(key in results)) continue;
    if (results[key] === value) {
      message += msg;
      return { status: "yellow", message };
    }
  }

  // Check low risk conditions
  const lowRiskConditions = {
    'external_call': ['1', "Has external calls. Potential risk.\n"],
    'is_whitelisted': ['1', "Has whitelisting capabilities. Usually low risk but could be used in tandem with honeypots/disabling trading.\n"],
    'is_mintable': ['1', "More tokens can be minted. Ensure this is not abused.\n"],
    'is_locked': ['0', "Owner supply is not locked. Ensure this is not abused.\n"]
  };

  for (const [key, [value, msg]] of Object.entries(lowRiskConditions)) {
    if (!results || !(key in results)) continue;
    if (results[key] === value) {
      message += msg;
      return { status: "green", message };
    }
  }

  return { status: "green", message: "No significant risks detected."};
};

export const updateOrGetTokenSecurityStatus = async (
  tokenAddresses: string[],
  chainId: string
): Promise<Record<string, { audit_report: string; status: string; blockchain: string; address: string }> | null> => {
  try {
    const securityData: Record<string, { audit_report: string; status: string; blockchain: string; address: string }> = {};

    const { data: existingTokens } = await supabase
      .from('smith_audits')
      .select('blockchain, address, audit_report, status')
      .eq('blockchain', chainId)
      .in('address', tokenAddresses);

    const existingAddresses = new Set(existingTokens?.map(t => t.address) || []);
    const newAddresses = tokenAddresses.filter(addr => !existingAddresses.has(addr));

    // Get existing security data
    existingTokens?.forEach(token => {
      securityData[token.address] = {
        audit_report: token.audit_report,
        status: token.status,
        blockchain: token.blockchain,
        address: token.address
      };
    });

    // Fetch and store new token security data
    for (const tokenAddress of newAddresses) {
      const response = await fetch(
        `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`
      );

      if (!response.ok) {
        console.error(`Failed to fetch security data for token ${tokenAddress}`);
        continue;
      }

      const data = await response.json();
      const tokenResults = data.result[tokenAddress];
      const securityEvaluation = evaluateSecurityRisks(tokenResults);
      
      securityData[tokenAddress] = {
        audit_report: securityEvaluation.message,
        status: securityEvaluation.status,
        blockchain: chainId,
        address: tokenAddress
      };

      // Store new security data in Supabase with upsert
      await supabase
        .from('smith_audits')
        .upsert({
          blockchain: chainId,
          address: tokenAddress,
          audit_report: securityEvaluation.message,
          raw_results: tokenResults,
          status: securityEvaluation.status
        }, {
          onConflict: 'blockchain,address'
        });
    }

    return securityData;
  } catch (error) {
    console.error("Error fetching/storing token security status:", error);
    return null;
  }
};
