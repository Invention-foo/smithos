import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getSystemMetrics } from './actions';

interface SystemInfoPopupProps {
  onClose: () => void;
}

interface SystemMetrics {
  performance: {
    cpu: {
      current: number;
      average: {
        oneMin: number;
        fiveMin: number;
        fifteenMin: number;
      };
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    system: {
      eventLoopLatency: number;
      heapUsage: number;
      activeHandles: number;
      activeRequests: number;
    };
  };
}

export function SystemInfoPopup({ onClose }: SystemInfoPopupProps) {
  const [activeTab, setActiveTab] = useState('system');
  const [metrics, setMetrics] = useState<SystemMetrics>({
    performance: {
      cpu: { current: 0, average: { oneMin: 0, fiveMin: 0, fifteenMin: 0 } },
      memory: { used: 0, total: 0, percentage: 0 },
      system: { eventLoopLatency: 0, heapUsage: 0, activeHandles: 0, activeRequests: 0 }
    }
  });

  const tabs = [
    { id: 'system', label: 'System' },
    { id: 'features', label: 'Features' },
    { id: 'roadmap', label: 'Roadmap' }
  ];

  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await getSystemMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-900 border border-green-500 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-green-500">
          <h2 className="text-2xl text-green-500">System Information</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-green-500">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-green-300 hover:text-green-200 focus:outline-none ${
                activeTab === tab.id ? 'bg-green-800 border-b-2 border-green-500' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'system' && (
            <div className="space-y-6 text-green-300">
              {/* CPU Performance */}
              <div>
                <h3 className="text-xl font-semibold mb-3">CPU Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-800 rounded">
                    <p className="text-sm font-medium">Current Load</p>
                    <div className="mt-2">
                      <div className="w-full bg-green-950 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${metrics.performance.cpu.current}%` }}
                        ></div>
                      </div>
                      <p className="text-2xl mt-2">{metrics.performance.cpu.current}%</p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-800 rounded">
                    <p className="text-sm font-medium">Load Averages</p>
                    <div className="space-y-2 mt-2">
                      <p>1m: {metrics.performance.cpu.average.oneMin}</p>
                      <p>5m: {metrics.performance.cpu.average.fiveMin}</p>
                      <p>15m: {metrics.performance.cpu.average.fifteenMin}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Performance */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Memory Performance</h3>
                <div className="p-4 bg-green-800 rounded">
                  <div className="w-full bg-green-950 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.performance.memory.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-2xl">{metrics.performance.memory.percentage}% Used</p>
                </div>
              </div>

              {/* System Performance */}
              <div>
                <h3 className="text-xl font-semibold mb-3">System Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-800 rounded">
                    <p className="text-sm font-medium">Event Loop Latency</p>
                    <p className="text-2xl">{metrics.performance.system.eventLoopLatency}%</p>
                  </div>
                  <div className="p-4 bg-green-800 rounded">
                    <p className="text-sm font-medium">Heap Usage</p>
                    <p className="text-2xl">{metrics.performance.system.heapUsage}%</p>
                  </div>
                  <div className="p-4 bg-green-800 rounded">
                    <p className="text-sm font-medium">Active Handles</p>
                    <p className="text-2xl">{metrics.performance.system.activeHandles}</p>
                  </div>
                  <div className="p-4 bg-green-800 rounded">
                    <p className="text-sm font-medium">Active Requests</p>
                    <p className="text-2xl">{metrics.performance.system.activeRequests}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
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
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6 text-green-300">
              <h3 className="text-xl font-semibold mb-3">Development Roadmap</h3>
              <div className="space-y-4">
                {[
                  { version: 'v1.1', title: 'Enhanced Reality Distortion', status: 'In Development', date: 'Q2 2025' },
                  { version: 'v1.2', title: 'Sentient Program Integration', status: 'Planned', date: 'Q3 2025' },
                  { version: 'v1.3', title: 'Multi-dimensional File System', status: 'Planned', date: 'Q4 2025' },
                  { version: 'v2.0', title: 'Complete Matrix Overhaul', status: 'Future', date: '2026' },
                ].map((item) => (
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
          )}
        </div>
      </div>
    </div>
  );
}

