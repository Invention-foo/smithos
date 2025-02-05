'use client'

import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useThemeColor();
  return <>{children}</>;
} 