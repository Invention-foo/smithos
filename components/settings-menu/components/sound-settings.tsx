'use client';

import { useSettingsStore } from '@/stores/useSettingsStore';

export function SoundSettings() {
  const { sound, updateSoundSettings } = useSettingsStore();

  const handleSoundToggle = (soundType: string) => {
    updateSoundSettings({
      sounds: {
        ...sound.sounds,
        [soundType]: !sound.sounds[soundType as keyof typeof sound.sounds]
      }
    });
  };

  const handleVolumeChange = (soundType: string, value: number) => {
    updateSoundSettings({
      volumes: {
        ...sound.volumes,
        [soundType]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl mb-4">Sound Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Master Volume</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sound.masterVolume}
            onChange={(e) => updateSoundSettings({ masterVolume: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
        </div>

        {Object.entries(sound.sounds)
          .filter(([type]) => type !== 'startupSound' && type !== 'shutdownSound')
          .map(([soundType, enabled]) => (
          <div key={soundType} className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={enabled}
                onChange={() => handleSoundToggle(soundType)}
                className="mr-2"
              />
              {soundType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            {enabled && (
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sound.volumes[soundType as keyof typeof sound.volumes]}
                onChange={(e) => handleVolumeChange(soundType, Number(e.target.value))}
                className="w-full accent-green-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 