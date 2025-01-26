import { useState, useEffect } from 'react'

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)

  const bootLines = [
    "Initializing SmithOS v1.0...",
    "Loading core systems...",
    "Establishing connection to RPC node...",
    "Bypassing firewalls...",
    "Decrypting neural interfaces...",
    "Compiling reality distortion fields...",
    "Synchronizing with the Source...",
    "SmithOS boot sequence complete."
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setTimeout(onComplete, 1000) // Delay before showing Agent Smith
          return 100
        }
        const newProgress = Math.min(oldProgress + Math.random() * 10, 100)
        setCurrentLine(Math.floor((newProgress / 100) * bootLines.length))
        return newProgress
      })
    }, 200)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="bg-black text-green-500 min-h-screen font-mono p-4 flex flex-col justify-between">
      <div>
        {bootLines.slice(0, currentLine + 1).map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>
      <div className="w-full bg-green-900 rounded-full h-2.5">
        <div 
          className="bg-green-500 h-2.5 rounded-full transition-all duration-200 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

