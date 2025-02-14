import React, { useState } from 'react';
import { Monitor, Terminal, Volume2 } from 'lucide-react';
import type { SettingsMenuProps } from '@/types/settings';
import { SettingsTab } from './components/settings-tab';
import { DisplaySettings } from './components/display-settings';
import { TerminalSettings } from './components/terminal-settings';
import { SoundSettings } from './components/sound-settings';
import { ModalWrapper } from '@/components/modal-wrapper';

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const [activeTab, setActiveTab] = useState('display');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'display':
        return <DisplaySettings />;
      case 'terminal':
        return <TerminalSettings />;
      case 'sound':
        return <SoundSettings />;
      default:
        return null;
    }
  };

  return (
    <ModalWrapper onClose={onClose} className="bg-green-900 border border-green-500 p-6 rounded-lg w-3/4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">Settings</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">Close</button>
      </div>
      <div className="flex">
        <div className="w-1/4 pr-4 border-r border-green-500">
          <ul>
            <SettingsTab icon={<Monitor size={18} />} label="Display Settings" id="display" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SettingsTab icon={<Terminal size={18} />} label="Terminal Settings" id="terminal" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SettingsTab icon={<Volume2 size={18} />} label="Sound Settings" id="sound" activeTab={activeTab} setActiveTab={setActiveTab} />
          </ul>
        </div>
        <div className="w-3/4 pl-4">
          {renderTabContent()}
        </div>
      </div>
    </ModalWrapper>
  );
}

