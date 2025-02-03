'use client';

import { useSettingsStore } from '@/stores/useSettingsStore';

export function DisplaySettings() {
  const { display, updateDisplaySettings } = useSettingsStore();

  const predefinedColors = [
    { name: 'Matrix Green', value: '#00ff00' },
    { name: 'Cyber Blue', value: '#00ffff' },
    { name: 'Neon Purple', value: '#ff00ff' },
    { name: 'Digital Red', value: '#ff0000' },
    { name: 'Hacker Yellow', value: '#ffff00' },
  ];

  const handleColorChange = (color: string) => {
    // Convert hex to RGB to check brightness
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness < 50) {
      alert('Please select a brighter color. Very dark colors may make the interface unusable.');
      return;
    }

    updateDisplaySettings({ themeColor: color });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl mb-4">Display Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Theme Color</label>
          <div className="flex gap-2 flex-wrap">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                className={`w-10 h-10 rounded-full border-2 ${
                  display.themeColor === color.value ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => updateDisplaySettings({ themeColor: color.value })}
                title={color.name}
              />
            ))}
          </div>
          <input 
            type="color" 
            value={display.themeColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="mt-2 w-full h-10 rounded"
          />
        </div>
      </div>
    </div>
  );
} 