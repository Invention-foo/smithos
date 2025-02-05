'use client'

import { useEffect } from 'react'
import { useSound } from '@/hooks/useSound'

export function SoundHandler() {
  const { playKeyPress, playSystemEffect } = useSound()

  useEffect(() => {
    const handleKeyPress = () => {
      playKeyPress()
    }

    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof Element && 
        (e.target.tagName.toLowerCase() === 'button' || 
         e.target.getAttribute('role') === 'button' ||
         e.target.closest('button') || 
         e.target.closest('[role="button"]'))
      ) {
        playSystemEffect('click')
      }
    }

    // Add event listeners
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('click', handleClick)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('click', handleClick)
    }
  }, [playKeyPress, playSystemEffect])

  // This component doesn't render anything
  return null
}