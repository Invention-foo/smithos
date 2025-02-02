export function FirewallConfiguration() {
  return (
    <div>
      <h3 className="text-xl mb-4">Firewall Configuration</h3>
      <p className="mb-4">Adjust your system's security settings:</p>
      <div className="space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" /> Enable Advanced Encryption
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" /> Activate Stealth Mode
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" /> Block Unauthorized Access Attempts
        </label>
      </div>
    </div>
  );
} 