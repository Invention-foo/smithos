import React, { useState } from 'react';
import { X, File } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
}

interface DocumentsModalProps {
  onClose: () => void;
}

const documents: Document[] = [
  {
    id: '1',
    title: 'Smart Contract Honeypot Detection',
    content: `Date: 2199-07-21
Location: Sector 9C
Details: Agent Smith has identified a sophisticated honeypot contract masquerading as a high-yield farming protocol. The contract uses a complex series of external calls to trap user funds. Signature: 0x7f1e...a3b9. Exercise extreme caution when interacting with contracts from unknown sources.`
  },
  {
    id: '2',
    title: 'Code Audit: NeoToken Vulnerabilities',
    content: `Audit Date: 2199-08-03
Target: NeoToken (NEO)

Critical Vulnerabilities:
1. Unprotected Mint Function: The 'mint' function lacks access controls, allowing anyone to create tokens at will.
2. Reentrancy in Withdrawal: The 'withdraw' function is susceptible to reentrancy attacks, potentially draining the contract.

Recommendations:
1. Implement 'onlyOwner' modifier for the mint function.
2. Use the checks-effects-interactions pattern in the withdraw function.
3. Consider implementing the ReentrancyGuard from OpenZeppelin.

Action: Immediate patching required. All interactions with NeoToken should be halted until fixes are implemented and verified.`
  },
  {
    id: '3',
    title: 'Matrix Protocol Exploit Analysis',
    content: `Incident Date: 2199-09-15
Protocol: MatrixSwap DEX

Exploit Summary:
Agent Smith has uncovered a critical exploit in the MatrixSwap decentralized exchange. The attacker manipulated the price oracle by flash-loaning a large amount of tokens, artificially inflating the price, and then performing a series of swaps to drain liquidity pools.

Exploit Details:
1. Flash loan of 1,000,000 MTX tokens from AaveV3
2. Deposit into MatrixSwap liquidity pool, skewing the price
3. Swap 50,000 ETH for inflated MTX tokens
4. Withdraw liquidity and repay flash loan

Impact: Approximately 150,000 ETH stolen from various liquidity pools.

Mitigation:
1. Implement circuit breakers for large price movements
2. Use time-weighted average prices (TWAP) for more robust oracle data
3. Limit the impact of single transactions on pool prices

Status: Emergency shutdown initiated. Team is working on a fix and considering a potential rollback.`
  }
];

export function DocumentsModal({ onClose }: DocumentsModalProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-green-500">Documents</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 overflow-y-auto pr-4 border-r border-green-500">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center p-2 cursor-pointer hover:bg-green-800"
                onClick={() => setSelectedDocument(doc)}
              >
                <File className="mr-2 text-green-500" size={20} />
                <span className="text-green-300">{doc.title}</span>
              </div>
            ))}
          </div>
          <div className="w-2/3 pl-4 overflow-y-auto">
            {selectedDocument ? (
              <div>
                <h3 className="text-xl text-green-500 mb-4">{selectedDocument.title}</h3>
                <pre className="text-green-300 whitespace-pre-wrap font-mono">{selectedDocument.content}</pre>
              </div>
            ) : (
              <div className="text-green-500 flex items-center justify-center h-full">
                Select a document to view its contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

