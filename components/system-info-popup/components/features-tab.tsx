export function FeaturesTab() {
  return (
    <div className="space-y-6 text-green-300">
      <h3 className="text-xl font-semibold mb-3">Current Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-800 rounded">
          <h4 className="font-semibold mb-2">Advanced Matrix Integration</h4>
          <p className="text-sm">Seamless integration with the Matrix protocol for enhanced data processing.</p>
        </div>
        <div className="p-4 bg-green-800 rounded">
          <h4 className="font-semibold mb-2">Quantum Encryption Protocols</h4>
          <p className="text-sm">State-of-the-art encryption using quantum algorithms.</p>
        </div>
        <div className="p-4 bg-green-800 rounded">
          <h4 className="font-semibold mb-2">Neural Interface Compatibility</h4>
          <p className="text-sm">Direct neural connection support for enhanced user interaction.</p>
        </div>
        <div className="p-4 bg-green-800 rounded">
          <h4 className="font-semibold mb-2">Temporal Manipulation Subsystems</h4>
          <p className="text-sm">Advanced time management and manipulation capabilities.</p>
        </div>
      </div>
    </div>
  );
} 