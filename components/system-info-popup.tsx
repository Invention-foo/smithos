import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SystemInfoPopupProps {
  onClose: () => void;
}

export function SystemInfoPopup({ onClose }: SystemInfoPopupProps) {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: 'System' },
    { id: 'features', label: 'Features' },
    { id: 'roadmap', label: 'Roadmap' }
  ];

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
              <div>
                <h3 className="text-xl font-semibold mb-3">SmithOS</h3>
                <p>Version: 0.1.0 (Build 2025.01.31)</p>
                <p className="text-sm text-green-400 mt-1">Built by Project Athena</p>
                <p className="text-sm text-green-400">Powered by Arc's Reactor Mk1</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">System Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-800 rounded">
                    <p className="text-sm font-medium">Memory Usage</p>
                    <p className="text-2xl">64%</p>
                  </div>
                  <div className="p-3 bg-green-800 rounded">
                    <p className="text-sm font-medium">CPU Load</p>
                    <p className="text-2xl">42%</p>
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

