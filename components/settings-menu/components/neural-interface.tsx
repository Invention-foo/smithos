export function NeuralInterface() {
  return (
    <div>
      <h3 className="text-xl mb-4">Neural Interface</h3>
      <p className="mb-4">Customize your neural interface settings:</p>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Interface Speed</label>
          <input type="range" min="1" max="100" className="w-full" />
        </div>
        <div>
          <label className="block mb-2">Neural Sensitivity</label>
          <input type="range" min="1" max="100" className="w-full" />
        </div>
      </div>
    </div>
  );
} 