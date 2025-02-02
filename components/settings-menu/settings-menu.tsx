import React, { useState } from 'react';
import { Sliders, Shield, Eye, Clock, User } from 'lucide-react';
import type { SettingsMenuProps } from '@/types/settings';
import { SettingsTab } from './components/settings-tab';
import { SystemCamouflage } from './components/system-camouflage';
import { FirewallConfiguration } from './components/firewall-config';
import { NeuralInterface } from './components/neural-interface';
import { TimeDistortion } from './components/time-distortion';
import { AgentClearance } from './components/agent-clearance';

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const [activeTab, setActiveTab] = useState('camouflage');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'camouflage':
        return <SystemCamouflage />;
      case 'firewall':
        return <FirewallConfiguration />;
      case 'neural':
        return <NeuralInterface />;
      case 'time':
        return <TimeDistortion />;
      case 'clearance':
        return <AgentClearance />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-3/4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-green-500">Settings</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">Close</button>
        </div>
        <div className="flex">
          <div className="w-1/4 pr-4 border-r border-green-500">
            <ul>
              <SettingsTab icon={<Sliders size={18} />} label="System Camouflage" id="camouflage" activeTab={activeTab} setActiveTab={setActiveTab} />
              <SettingsTab icon={<Shield size={18} />} label="Firewall Configuration" id="firewall" activeTab={activeTab} setActiveTab={setActiveTab} />
              <SettingsTab icon={<Eye size={18} />} label="Neural Interface" id="neural" activeTab={activeTab} setActiveTab={setActiveTab} />
              <SettingsTab icon={<Clock size={18} />} label="Time Distortion" id="time" activeTab={activeTab} setActiveTab={setActiveTab} />
              <SettingsTab icon={<User size={18} />} label="Agent Clearance Level" id="clearance" activeTab={activeTab} setActiveTab={setActiveTab} />
            </ul>
          </div>
          <div className="w-3/4 pl-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

