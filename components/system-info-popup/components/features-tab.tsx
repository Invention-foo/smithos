export function FeaturesTab() {
    return (
        <div className="space-y-3 text-green-300">
            {/* SmithOS Programs */}
            <div>
                <h3 className="text-lg font-semibold mb-1.5">SmithOS Programs</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">Dashboard</h4>
                        <p className="text-xs text-green-400">Detailed view of user assets and value over time.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">CodeSeer</h4>
                        <p className="text-xs text-green-400">Advanced smart contract analysis and token security auditing.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">NeuralScan</h4>
                        <p className="text-xs text-green-400">On-chain transaction monitoring and token analysis.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">Terminal</h4>
                        <p className="text-xs text-green-400">Command-line interface for direct system interaction.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">NeoGuard</h4>
                        <p className="text-xs text-green-400">AI-powered Telegram community security system.</p>
                    </div>
                </div>
            </div>

            {/* Agent Smith Features */}
            <div>
                <h3 className="text-lg font-semibold mb-1.5">Agent Smith Features</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">On-chain Protection</h4>
                        <p className="text-xs text-green-400">Safeguards users from executing harmful transactions, purchasing scam tokens, and interacting with wallet drainers by analyzing blockchain activity in real time.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">Off-chain Security</h4>
                        <p className="text-xs text-green-400">Detects and prevents phishing attempts, social engineering scams, and fraudulent schemes on social platforms, ensuring users stay safe beyond the blockchain.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">Autonomous Threat Detection</h4>
                        <p className="text-xs text-green-400">Continuously monitors for potential exploits, vulnerabilities, and suspicious activity, providing proactive security alerts before threats escalate.</p>
                    </div>
                    <div className="p-2 bg-green-800 rounded">
                        <h4 className="font-medium text-sm">Risk-aware Trade Execution</h4>
                        <p className="text-xs text-green-400">Automatically executes protective trades or withdrawals when high-risk activity is detected, helping users mitigate financial losses in real time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 