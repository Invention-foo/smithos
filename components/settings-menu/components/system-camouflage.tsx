export function SystemCamouflage() {
  const colorSchemes = ['Green', 'Blue', 'Red'];
  return (
    <div>
      <h3 className="text-xl mb-4">System Camouflage</h3>
      <p className="mb-4">Select a color scheme for your system:</p>
      <div className="flex space-x-4">
        {colorSchemes.map((scheme) => (
          <button key={scheme} className={`px-4 py-2 rounded ${scheme.toLowerCase() === 'green' ? 'bg-green-500' : scheme.toLowerCase() === 'blue' ? 'bg-blue-500' : 'bg-red-500'}`}>
            {scheme}
          </button>
        ))}
      </div>
    </div>
  );
} 