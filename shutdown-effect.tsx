'use client'

import { useEffect, useRef } from 'react'

interface ShutdownEffectProps {
  onComplete: () => void;
}

export function ShutdownEffect({ onComplete }: ShutdownEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 20)
    const rows = Math.floor(canvas.height / 20)
    const dissolveStates: number[][] = Array(columns).fill(0).map(() => Array(rows).fill(0))
    
    let opacity = 1
    let completed = 0
    const totalCells = columns * rows

    function draw() {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '15px monospace'
      
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (dissolveStates[i][j] === 0 && Math.random() < 0.03) {
            dissolveStates[i][j] = 1
            completed++
          }

          if (dissolveStates[i][j] === 1) {
            const x = i * 20
            const y = j * 20
            const char = String.fromCharCode(Math.random() * 128)
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`
            ctx.fillText(char, x, y)
          }
        }
      }

      if (completed >= totalCells * 0.7) {
        opacity -= 0.02
        if (opacity <= 0) {
          onComplete()
          return
        }
      }

      requestAnimationFrame(draw)
    }

    draw()
  }, [onComplete])

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-50 bg-black"
      aria-label="Shutdown effect"
    />
  )
}

