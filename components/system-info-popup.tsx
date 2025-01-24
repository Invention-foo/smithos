import React from 'react';
import { X } from 'lucide-react';

interface SystemInfoPopupProps {
  onClose: () => void;
}

export function SystemInfoPopup({ onClose }: SystemInfoPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-green-500">System Information</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4 text-green-300">
          <div>
            <h3 className="text-lg font-semibold mb-2">SmithOS</h3>
            <p>Version: 1.0.0 (Build 20XX.06.15)</p>
            <p className="text-sm text-green-400 mt-1">Built by Project Athena</p>
            <p className="text-sm text-green-400">Powered by Arc's Reactor Mk1</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside">
              <li>Advanced Matrix Integration</li>
              <li>Quantum Encryption Protocols</li>
              <li>Neural Interface Compatibility</li>
              <li>Temporal Manipulation Subsystems</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Roadmap</h3>
            <ul className="list-disc list-inside">
              <li>v1.1: Enhanced Reality Distortion</li>
              <li>v1.2: Sentient Program Integration</li>
              <li>v1.3: Multi-dimensional File System</li>
              <li>v2.0: Complete Matrix Overhaul</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

