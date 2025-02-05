import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { ModalWrapper } from "@/components/modal-wrapper"

interface CodeRainProps {
  onClose: () => void
}

interface FallingCharacter {
  id: number
  char: string
  x: number
  y: number
  speed: number
}

export function CodeRain({ onClose }: CodeRainProps) {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [characters, setCharacters] = useState<FallingCharacter[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [level, setLevel] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()
  const gameAreaWidth = 400
  const gameAreaHeight = 300

  useEffect(() => {
    const savedHighScore = localStorage.getItem("codeRainHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore, 10))
    }
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("codeRainHighScore", score.toString())
    }
  }, [score, highScore])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return
      
      const char = e.key.toLowerCase()
      if (char.length === 1) {
        setCurrentInput(char)
        checkCollision(char)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [characters, gameOver])

  useEffect(() => {
    if (!gameOver) {
      const params = getGameParams(level)
      
      const spawnInterval = setInterval(() => {
        if (Math.random() < params.spawnRate) {
          const newChar: FallingCharacter = {
            id: Date.now(),
            char: String.fromCharCode(97 + Math.floor(Math.random() * 26)),
            x: Math.random() * (gameAreaWidth - 20),
            y: 0,
            speed: params.minSpeed + Math.random() * params.maxSpeedBonus
          }
          setCharacters(prev => [...prev, newChar])
        }
      }, params.spawnInterval)

      const gameLoop = () => {
        setCharacters(prev => {
          const updated = prev.map(char => ({
            ...char,
            y: char.y + char.speed
          }))
          
          if (updated.some(char => char.y > gameAreaHeight - 20)) {
            setGameOver(true)
            return prev
          }
          
          return updated.filter(char => char.y <= gameAreaHeight - 20)
        })
        
        frameRef.current = requestAnimationFrame(gameLoop)
      }
      
      frameRef.current = requestAnimationFrame(gameLoop)

      return () => {
        clearInterval(spawnInterval)
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
      }
    }
  }, [gameOver, level])

  const checkCollision = (input: string) => {
    setCharacters(prev => {
      const charIndex = prev.findIndex(char => char.char === input)
      if (charIndex !== -1) {
        setScore(s => s + 1)
        return prev.filter((_, i) => i !== charIndex)
      }
      return prev
    })
  }

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
    setCharacters([])
    setCurrentInput("")
  }

  const getGameParams = (currentLevel: number) => {
    return {
      spawnRate: Math.min(0.3 + (currentLevel - 1) * 0.1, 0.7),
      spawnInterval: Math.max(800 - (currentLevel - 1) * 50, 300),
      minSpeed: 0.5 + (currentLevel - 1) * 0.2,
      maxSpeedBonus: 0.8 + (currentLevel - 1) * 0.1
    }
  }

  useEffect(() => {
    const newLevel = Math.floor(score / 10) + 1
    if (newLevel !== level) {
      setLevel(newLevel)
    }
  }, [score])

  return (
    <ModalWrapper onClose={onClose} className="p-6 rounded-lg w-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">Code Rain</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-green-300 mb-2">Score: {score}</p>
        <p className="text-green-300 mb-2">Level: {level}</p>
        <p className="text-green-300">High Score: {highScore}</p>
      </div>

      <div 
        className="relative bg-black border border-green-500 mx-auto overflow-hidden"
        style={{ width: gameAreaWidth, height: gameAreaHeight }}
      >
        {characters.map(char => (
          <div
            key={char.id}
            className="absolute text-green-500 font-mono"
            style={{
              left: char.x,
              top: char.y,
              transform: `translateY(0)`
            }}
          >
            {char.char}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="text-center mt-4">
          <p className="text-red-500 mb-4">Game Over!</p>
          <button 
            onClick={resetGame}
            className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="text-center mt-4 text-green-300">
        <p>Type the falling letters before they hit the bottom!</p>
        {currentInput && <p>Last typed: {currentInput}</p>}
      </div>
    </ModalWrapper>
  )
} 