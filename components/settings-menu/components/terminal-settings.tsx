'use client';

import { useSettingsStore } from '@/stores/useSettingsStore';

export function TerminalSettings() {
  const { terminal, updateTerminalSettings } = useSettingsStore();
  
  const fontOptions = ['monospace', 'Courier New', 'Consolas', 'Fira Code'];

  return (
    <div className="space-y-6">
      <h3 className="text-xl mb-4">Terminal Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Font Size ({terminal.fontSize}px)</label>
          <input 
            type="range" 
            min="8" 
            max="24" 
            value={terminal.fontSize}
            onChange={(e) => updateTerminalSettings({ fontSize: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
        </div>

        <div>
          <label className="block mb-2">Font Family</label>
          <select 
            value={terminal.fontFamily}
            onChange={(e) => updateTerminalSettings({ fontFamily: e.target.value })}
            className="w-full p-2 bg-green-900 border border-green-500 rounded"
          >
            {fontOptions.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Prompt Style</label>
          <input 
            type="text" 
            value={terminal.promptStyle}
            onChange={(e) => updateTerminalSettings({ promptStyle: e.target.value })}
            className="w-full p-2 bg-green-900 border border-green-500 rounded"
          />
        </div>
      </div>
    </div>
  );
} 