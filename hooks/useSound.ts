import { useSettingsStore } from '@/stores/useSettingsStore'

export function useSound() {
  const { sound } = useSettingsStore()
  
  // Create a single AudioContext instance
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  const playKeyPress = () => {
    if (!sound.sounds.keyboardSounds) return
    
    // Resume the context if it's suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Higher frequency, shorter duration for a crisper click
    oscillator.type = 'square'  // More mechanical sound than sine
    oscillator.frequency.setValueAtTime(2000, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.01)
    
    const volume = (sound.masterVolume / 100) * (sound.volumes.keyboardSounds / 100) * 0.03  // Reduced volume
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02)  // Shorter duration
    oscillator.stop(audioContext.currentTime + 0.02)
  }

  const playSystemEffect = (type: 'click' | 'error' | 'success' | 'notification' = 'click') => {
    if (!sound.sounds.systemEffects) return

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Start the oscillator first
    oscillator.start()

    // Then configure the sound based on type
    switch (type) {
      case 'error':
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(350, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime((sound.masterVolume / 100) * (sound.volumes.systemEffects / 100) * 0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.stop(audioContext.currentTime + 0.2)
        break

      case 'success':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1800, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime((sound.masterVolume / 100) * (sound.volumes.systemEffects / 100) * 0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        oscillator.stop(audioContext.currentTime + 0.15)
        break

      case 'notification':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime((sound.masterVolume / 100) * (sound.volumes.systemEffects / 100) * 0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.stop(audioContext.currentTime + 0.2)
        break

      default: // click
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05)
        gainNode.gain.setValueAtTime((sound.masterVolume / 100) * (sound.volumes.systemEffects / 100) * 0.03, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
        oscillator.stop(audioContext.currentTime + 0.05)
    }
  }

  const playStartupSound = async () => {
    if (!sound.sounds.startupSound) return

    // Always create a fresh context for the startup sound
    const startupContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    const oscillator1 = startupContext.createOscillator()
    const oscillator2 = startupContext.createOscillator()
    const gainNode = startupContext.createGain()

    // Configure oscillators
    oscillator1.type = 'sine'
    oscillator2.type = 'square'

    // Reduced volume
    const volume = (sound.masterVolume / 100) * (sound.volumes.startupSound / 100) * 0.08
    gainNode.gain.setValueAtTime(volume, startupContext.currentTime)

    // Connect nodes
    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    gainNode.connect(startupContext.destination)

    // Start oscillators
    oscillator1.start()
    oscillator2.start()

    // Extended startup sequence
    const startTime = startupContext.currentTime
    const duration = 1.2 // Extended from 0.6 to 1.2 seconds
    
    // First oscillator: longer rising sweep
    oscillator1.frequency.setValueAtTime(150, startTime)
    oscillator1.frequency.exponentialRampToValueAtTime(600, startTime + duration)
    
    // Second oscillator: more digital accents
    oscillator2.frequency.setValueAtTime(300, startTime)
    oscillator2.frequency.setValueAtTime(450, startTime + duration * 0.25)
    oscillator2.frequency.setValueAtTime(600, startTime + duration * 0.5)
    oscillator2.frequency.setValueAtTime(750, startTime + duration * 0.75)

    // Gradual fade out
    gainNode.gain.setValueAtTime(volume, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    // Stop oscillators
    oscillator1.stop(startTime + duration)
    oscillator2.stop(startTime + duration)

    // Clean up context after sound finishes
    return new Promise(resolve => {
      setTimeout(() => {
        startupContext.close()
        resolve(true)
      }, duration * 1000 + 100)
    })
  }
  
  return { playKeyPress, playSystemEffect, playStartupSound }
} 