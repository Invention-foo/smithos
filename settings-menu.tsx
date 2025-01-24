import React, { useState } from 'react';
import { Sliders, Shield, Eye, Clock, User } from 'lucide-react';

interface SettingsMenuProps {
  onClose: () => void;
}

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

interface SettingsTabProps {
  icon: React.ReactNode;
  label: string;
  id: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

function SettingsTab({ icon, label, id, activeTab, setActiveTab }: SettingsTabProps) {
  return (
    <li 
      className={`flex items-center p-2 cursor-pointer ${activeTab === id ? 'bg-green-700' : 'hover:bg-green-800'}`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </li>
  );
}

function SystemCamouflage() {
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

function FirewallConfiguration() {
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

function NeuralInterface() {
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

function TimeDistortion() {
  return (
    <div>
      <h3 className="text-xl mb-4">Time Distortion</h3>
      <p className="mb-4">Adjust the perceived passage of time:</p>
      <div className="space-y-4">
        <button className="px-4 py-2 bg-green-700 rounded">Slow Down Time</button>
        <button className="px-4 py-2 bg-green-700 rounded">Speed Up Time</button>
        <button className="px-4 py-2 bg-green-700 rounded">Reset to Normal</button>
      </div>
    </div>
  );
}

function AgentClearance() {
  return (
    <div>
      <h3 className="text-xl mb-4">Agent Clearance Level</h3>
      <p className="mb-4">Manage your agent status and permissions:</p>
      <div className="space-y-2">
        <p>Current Clearance Level: <span className="font-bold">Level 3</span></p>
        <button className="px-4 py-2 bg-green-700 rounded">Request Higher Clearance</button>
        <button className="px-4 py-2 bg-green-700 rounded">View Access Logs</button>
      </div>
    </div>
  );
}

