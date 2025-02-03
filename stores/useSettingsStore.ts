import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DisplaySettings {
  glowIntensity: number;
  rainSpeed: number;
  textColor: string;
  effects: {
    scanlines: boolean;
    blur: boolean;
    glitch: boolean;
    crt: boolean;
  };
}

interface TerminalSettings {
  fontSize: number;
  fontFamily: string;
  cursorStyle: string;
  blinkRate: number;
  promptStyle: string;
  historySize: number;
}

interface SoundSettings {
  masterVolume: number;
  sounds: {
    systemEffects: boolean;
    keyboardSounds: boolean;
    startupSound: boolean;
    shutdownSound: boolean;
  };
  volumes: {
    systemEffects: number;
    keyboardSounds: number;
    startupSound: number;
    shutdownSound: number;
  };
}

interface SettingsStore {
  display: DisplaySettings;
  terminal: TerminalSettings;
  sound: SoundSettings;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateTerminalSettings: (settings: Partial<TerminalSettings>) => void;
  updateSoundSettings: (settings: Partial<SoundSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      display: {
        glowIntensity: 50,
        rainSpeed: 50,
        textColor: '#00ff00',
        effects: {
          scanlines: true,
          blur: false,
          glitch: true,
          crt: false,
        },
      },
      terminal: {
        fontSize: 14,
        fontFamily: 'monospace',
        cursorStyle: 'block',
        blinkRate: 530,
        promptStyle: '> ',
        historySize: 1000,
      },
      sound: {
        masterVolume: 75,
        sounds: {
          systemEffects: true,
          keyboardSounds: true,
          startupSound: true,
          shutdownSound: true,
        },
        volumes: {
          systemEffects: 100,
          keyboardSounds: 80,
          startupSound: 90,
          shutdownSound: 90,
        },
      },
      updateDisplaySettings: (settings) =>
        set((state) => ({
          display: { ...state.display, ...settings },
        })),
      updateTerminalSettings: (settings) =>
        set((state) => ({
          terminal: { ...state.terminal, ...settings },
        })),
      updateSoundSettings: (settings) =>
        set((state) => ({
          sound: { ...state.sound, ...settings },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
); 