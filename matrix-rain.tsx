'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'

export interface MatrixRainRef {
  startFadeOut: () => void;
}

interface MatrixRainProps {
  isFadingOut: boolean;
}

interface CharacterInfo {
  x: number;
  y: number;
  char: string;
  visible: boolean;
  opacity: number;
  currentChar: string;
  formed: boolean;
  startTime: number;
}

export const MatrixRain = forwardRef<MatrixRainRef, MatrixRainProps>(({ isFadingOut }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [opacity, setOpacity] = useState(1)
  const animationRef = useRef<number>()
  const messageStarted = useRef(false)
  const messageComplete = useRef(false)
  const lastFormationTime = useRef(0)

  useImperativeHandle(ref, () => ({
    startFadeOut: () => {
      // Kept for backwards compatibility
    }
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 20)
    const drops: number[] = new Array(columns).fill(1)
    const welcomeMessage = 'WELCOME'
    const agentMessage = 'AGENT'
    const smithMessage = 'SMITH'
    
    const centerX = Math.floor(columns / 2)
    const welcomeX = centerX - 5
    const agentX = centerX
    const smithX = centerX + 5

    const messagePositions = new Map<string, CharacterInfo>()
    
    const setupMessage = (message: string, x: number, yOffset: number) => {
      message.split('').forEach((char, i) => {
        messagePositions.set(`${message.toLowerCase()}_${i}`, {
          x: x * 20,
          y: (yOffset + i) * 20,
          char,
          visible: false,
          opacity: 0,
          currentChar: '',
          formed: false,
          startTime: 0
        })
      })
    }

    setupMessage(welcomeMessage, welcomeX, 5)
    setupMessage(agentMessage, agentX, 15)
    setupMessage(smithMessage, smithX, 25)

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+{}[]|;:,.<>?'

    function draw() {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * opacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '20px monospace'

      const currentTime = Date.now()

      for (let i = 0; i < drops.length; i++) {
        const x = i * 20
        const y = drops[i] * 20

        const messageChar = Array.from(messagePositions.values()).find(pos => pos.x === x && pos.y <= y && !pos.formed)

        if (messageChar && messageChar.visible) {
          if (messageChar.opacity < 1) {
            messageChar.opacity += 0.01
          }
          
          if (!messageChar.formed) {
            messageChar.currentChar = chars[Math.floor(Math.random() * chars.length)]
            ctx.fillStyle = `rgba(0, 255, 0, ${messageChar.opacity * 0.5})`
            ctx.fillText(messageChar.currentChar, x, y)
          } else {
            ctx.fillStyle = `rgba(0, 255, 0, ${messageChar.opacity})`
            ctx.fillText(messageChar.char, x, messageChar.y)
          }
        } else {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.5})`
          ctx.fillText(text, x, y)
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      if (messageStarted.current && currentTime - lastFormationTime.current >= 300) {
        const unformedChars = Array.from(messagePositions.values()).filter(pos => pos.visible && !pos.formed)
        if (unformedChars.length > 0) {
          const randomIndex = Math.floor(Math.random() * unformedChars.length)
          const formingChar = unformedChars[randomIndex]
          formingChar.formed = true
          formingChar.currentChar = formingChar.char
          lastFormationTime.current = currentTime
        } else {
          messageComplete.current = true
        }
      }

      // Make characters visible gradually
      let visibleCount = 0
      messagePositions.forEach((pos) => {
        if (visibleCount < drops.length * 2) {
          pos.visible = true
          visibleCount++
        }
      })

      // Draw formed message characters on top with glow effect
      ctx.save()
      ctx.shadowBlur = 3  // Reduced from 5 to 3
      ctx.shadowColor = 'rgba(0, 255, 0, 0.3)'  // Reduced opacity from 0.5 to 0.3
      messagePositions.forEach(pos => {
        if (pos.formed) {
          ctx.fillStyle = 'rgba(0, 255, 0, 0.9)'  // Slightly reduced opacity from 1 to 0.9
          ctx.fillText(pos.char, pos.x, pos.y)
        }
      })
      ctx.restore()
    }

    function animate() {
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    setTimeout(() => {
      messageStarted.current = true
    }, 1000)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [opacity])

  useEffect(() => {
    if (isFadingOut) {
      const fadeOutInterval = setInterval(() => {
        setOpacity((prevOpacity) => {
          const newOpacity = prevOpacity - 0.05
          if (newOpacity <= 0) {
            clearInterval(fadeOutInterval)
            return 0
          }
          return newOpacity
        })
      }, 50)
      return () => clearInterval(fadeOutInterval)
    }
  }, [isFadingOut])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-50"
      style={{ opacity }}
      aria-label="Matrix-style transition effect"
    />
  )
})

MatrixRain.displayName = 'MatrixRain'

