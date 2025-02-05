import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getSystemMetrics } from './actions';
import { SystemTab } from './components/system-tab';
import { FeaturesTab } from './components/features-tab';
import { RoadmapTab } from './components/roadmap-tab';
import type { SystemMetrics } from '@/types/system';
import { ModalWrapper } from '@/components/modal-wrapper';

interface SystemInfoPopupProps {
  onClose: () => void;
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
    <ModalWrapper onClose={onClose} className="rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
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
        {activeTab === 'system' && <SystemTab metrics={metrics} />}
        {activeTab === 'features' && <FeaturesTab />}
        {activeTab === 'roadmap' && <RoadmapTab />}
      </div>
    </ModalWrapper>
  );
}

