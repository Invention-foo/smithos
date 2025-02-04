'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function useThemeColor() {
  const { display } = useSettingsStore();

  useEffect(() => {
    // Convert hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-color', display.themeColor);
    root.style.setProperty('--theme-color-rgb', display.themeColor.replace('#', ''));
    
    // Create dynamic styles
    const style = document.createElement('style');
    style.textContent = `
      /* Text colors - solid */
      .text-green-100 { color: color-mix(in srgb, var(--theme-color) 40%, white) !important; }
      .text-green-200 { color: color-mix(in srgb, var(--theme-color) 50%, white) !important; }
      .text-green-300 { color: color-mix(in srgb, var(--theme-color) 60%, white) !important; }
      .text-green-400 { color: color-mix(in srgb, var(--theme-color) 80%, white) !important; }
      .text-green-500 { color: var(--theme-color) !important; }
      .text-green-600 { color: color-mix(in srgb, var(--theme-color) 80%, black) !important; }
      .text-green-700 { color: color-mix(in srgb, var(--theme-color) 60%, black) !important; }
      
      /* Text colors - with opacity */
      .text-green-300\\/90 { color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 60%, white) 90%, transparent) !important; }
      .text-green-400\\/90 { color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, white) 90%, transparent) !important; }
      .text-green-400\\/80 { color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, white) 80%, transparent) !important; }
      .text-green-400\\/70 { color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, white) 70%, transparent) !important; }
      
      /* Ring colors */
      .ring-green-400 { --tw-ring-color: color-mix(in srgb, var(--theme-color) 80%, white) !important; }
      .ring-green-500 { --tw-ring-color: var(--theme-color) !important; }
      
      /* Focus ring colors */
      .focus\\:ring-green-400:focus { --tw-ring-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, white)) !important; }
      .focus\\:ring-green-500:focus { --tw-ring-color: var(--theme-color) !important; }
      
      /* Background colors - solid */
      .bg-green-500 { background-color: var(--theme-color) !important; }
      .bg-green-600 { background-color: color-mix(in srgb, var(--theme-color) 80%, black) !important; }
      .bg-green-700 { background-color: color-mix(in srgb, var(--theme-color) 60%, black) !important; }
      .bg-green-800 { background-color: color-mix(in srgb, var(--theme-color) 40%, black) !important; }
      .bg-green-900 { background-color: color-mix(in srgb, var(--theme-color) 30%, black) !important; }
      .bg-green-950 { background-color: color-mix(in srgb, var(--theme-color) 20%, black) !important; }
      
      /* Background colors - with opacity */
      .bg-green-500\\/90 { background-color: color-mix(in srgb, var(--theme-color) 90%, transparent) !important; }
      .bg-green-600\\/90 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, black) 90%, transparent) !important; }
      .bg-green-700\\/90 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 60%, black) 90%, transparent) !important; }
      .bg-green-800\\/90 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 40%, black) 90%, transparent) !important; }
      .bg-green-900\\/90 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 30%, black) 90%, transparent) !important; }
      
      .bg-green-500\\/60 { background-color: color-mix(in srgb, var(--theme-color) 60%, transparent) !important; }
      .bg-green-600\\/60 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, black) 60%, transparent) !important; }
      .bg-green-700\\/60 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 60%, black) 60%, transparent) !important; }
      .bg-green-800\\/60 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 40%, black) 60%, transparent) !important; }
      .bg-green-900\\/60 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 30%, black) 60%, transparent) !important; }
      
      .bg-green-500\\/50 { background-color: color-mix(in srgb, var(--theme-color) 50%, transparent) !important; }
      .bg-green-600\\/50 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 80%, black) 50%, transparent) !important; }
      .bg-green-700\\/50 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 60%, black) 50%, transparent) !important; }
      .bg-green-800\\/50 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 40%, black) 50%, transparent) !important; }
      .bg-green-900\\/50 { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 30%, black) 50%, transparent) !important; }
      
      .bg-green-500\\/30 { background-color: color-mix(in srgb, var(--theme-color) 30%, transparent) !important; }
      
      /* Border colors */
      .border-green-500 { border-color: var(--theme-color) !important; }
      
      /* Matrix background effect */
      .matrix-bg::before {
        background: linear-gradient(0deg, ${hexToRgba(display.themeColor, 0.03)} 25%, transparent 25%) !important;
      }
      .matrix-bg::after {
        background: linear-gradient(0deg, ${hexToRgba(display.themeColor, 0.02)} 25%, transparent 25%) !important;
      }

      /* Scrollbar */
      ::-webkit-scrollbar-thumb {
        background: var(--theme-color) !important;
      }
      
      * {
        scrollbar-color: var(--theme-color) #0a0a0a !important;
      }

      /* Special cases for contrast */
      .bg-green-500 .text-green-500,
      .bg-green-600 .text-green-500,
      .bg-green-700 .text-green-500,
      .bg-green-800 .text-green-500,
      .bg-green-900 .text-green-500 {
        color: white !important;
      }

      /* Hover states */
      .hover\\:text-green-300:hover { color: color-mix(in srgb, var(--theme-color) 60%, white) !important; }
      .hover\\:text-green-400:hover { color: color-mix(in srgb, var(--theme-color) 80%, white) !important; }
      .hover\\:text-green-500:hover { color: var(--theme-color) !important; }
      
      .hover\\:bg-green-400:hover { background-color: color-mix(in srgb, var(--theme-color) 80%, white) !important; }
      .hover\\:bg-green-500:hover { background-color: var(--theme-color) !important; }
      .hover\\:bg-green-600:hover { background-color: color-mix(in srgb, var(--theme-color) 80%, black) !important; }
      .hover\\:bg-green-700:hover { background-color: color-mix(in srgb, var(--theme-color) 60%, black) !important; }
      .hover\\:bg-green-800:hover { background-color: color-mix(in srgb, var(--theme-color) 40%, black) !important; }
      .hover\\:bg-green-900:hover { background-color: color-mix(in srgb, var(--theme-color) 30%, black) !important; }
      .hover\\:bg-green-950:hover { background-color: color-mix(in srgb, var(--theme-color) 20%, black) !important; }
      
      /* Hover with opacity */
      .hover\\:bg-opacity-80:hover { opacity: 0.8 !important; }
      .hover\\:bg-opacity-90:hover { opacity: 0.9 !important; }
      
      /* Background opacity hover combinations */
      .hover\\:bg-green-800\\/70:hover { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 40%, black) 70%, transparent) !important; }
      .hover\\:bg-green-700\\/70:hover { background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-color) 60%, black) 70%, transparent) !important; }
      
      /* Accent colors */
      .accent-green-500 { accent-color: var(--theme-color) !important; }

      /* Chart colors */
      :root {
        --chart-color: ${display.themeColor};
        --chart-color-20: ${hexToRgba(display.themeColor, 0.2)};
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [display.themeColor]);
}

export function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
} 