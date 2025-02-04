import type { Metadata } from 'next'
import './globals.css'
import { headers } from "next/headers";
import ContextProvider from '@/context';
import { ThemeProvider } from '@/components/theme-provider';
import { SoundHandler } from '@/components/sound-handler'

export const metadata: Metadata = {
  title: 'SmithOS',
  description: 'A Matrix-inspired operating system interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookies = headers().get('cookie');
  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <ThemeProvider>
            <SoundHandler />
            {children}
          </ThemeProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
