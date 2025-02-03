'use client';

import { useSettingsStore } from '@/stores/useSettingsStore';

export function DisplaySettings() {
  const { display, updateDisplaySettings } = useSettingsStore();
  
  const handleEffectToggle = (effect: string) => {
    updateDisplaySettings({
      effects: {
        ...display.effects,
        [effect]: !display.effects[effect as keyof typeof display.effects]
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl mb-4">Display Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Matrix Glow Intensity</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={display.glowIntensity}
            onChange={(e) => updateDisplaySettings({ glowIntensity: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
        </div>

        <div>
          <label className="block mb-2">Digital Rain Speed</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={display.rainSpeed}
            onChange={(e) => updateDisplaySettings({ rainSpeed: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
        </div>

        <div>
          <label className="block mb-2">Text Color</label>
          <input 
            type="color" 
            value={display.textColor}
            onChange={(e) => updateDisplaySettings({ textColor: e.target.value })}
            className="w-full h-10 rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block mb-2">Visual Effects</label>
          {Object.entries(display.effects).map(([effect, enabled]) => (
            <label key={effect} className="flex items-center">
              <input 
                type="checkbox" 
                checked={enabled}
                onChange={() => handleEffectToggle(effect)}
                className="mr-2"
              />
              {effect.charAt(0).toUpperCase() + effect.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 