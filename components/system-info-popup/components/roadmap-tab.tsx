export function RoadmapTab() {
  const roadmapItems = [
    { version: 'v1.1', title: 'Enhanced Reality Distortion', status: 'In Development', date: 'Q2 2025' },
    { version: 'v1.2', title: 'Sentient Program Integration', status: 'Planned', date: 'Q3 2025' },
    { version: 'v1.3', title: 'Multi-dimensional File System', status: 'Planned', date: 'Q4 2025' },
    { version: 'v2.0', title: 'Complete Matrix Overhaul', status: 'Future', date: '2026' },
  ];

  return (
    <div className="space-y-6 text-green-300">
      <h3 className="text-xl font-semibold mb-3">Development Roadmap</h3>
      <div className="space-y-4">
        {roadmapItems.map((item) => (
          <div key={item.version} className="p-4 bg-green-800 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{item.version}: {item.title}</h4>
                <p className="text-sm text-green-400 mt-1">Release: {item.date}</p>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-green-700">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 