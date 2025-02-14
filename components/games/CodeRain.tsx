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
  const [strikes, setStrikes] = useState(0)
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
        
        // Find all matching characters and sort by Y position (closest to bottom first)
        const matchingChars = characters
          .filter(c => c.char === char)
          .sort((a, b) => b.y - a.y)
        
        if (matchingChars.length > 0) {
          setScore(s => s + 1)
          // Remove only the first matching character (closest to bottom)
          setCharacters(prev => prev.filter(c => c.id !== matchingChars[0].id))
        } else {
          setStrikes(prev => {
            const newStrikes = prev + 1
            if (newStrikes >= 3) {
              setGameOver(true)
            }
            return newStrikes
          })
        }
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [gameOver, characters])

  useEffect(() => {
    if (!gameOver) {
      const params = getGameParams(level)
      const lastFrameY = new Map() // Track Y positions from last frame
      
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
          
          // Check for characters that just crossed the bottom boundary
          const bottomHitChars = updated.filter(char => {
            const lastY = lastFrameY.get(char.id) ?? 0
            const crossedBottom = lastY <= gameAreaHeight - 20 && char.y > gameAreaHeight - 20
            return crossedBottom
          })
          
          // Update last frame positions
          lastFrameY.clear()
          updated.forEach(char => lastFrameY.set(char.id, char.y))
          
          if (bottomHitChars.length > 0) {
            setStrikes(prev => {
              const newStrikes = prev + 1
              if (newStrikes >= 3) {
                setGameOver(true)
              }
              return newStrikes
            })
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

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
    setCharacters([])
    setCurrentInput("")
    setLevel(1)
    setStrikes(0)
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
  }, [score, level])

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
        <p className="text-green-300 mb-2">High Score: {highScore}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-green-300">Strikes:</span>
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`inline-block w-3 h-3 rounded-full ${
                i < strikes ? 'bg-red-500' : 'bg-green-700'
              }`}
            />
          ))}
        </div>
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
          <p className="text-red-500 mb-4">
            Game Over!
            {strikes >= 3 ? " Too many misses!" : " Character reached the bottom!"}
          </p>
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
        <p>Three strikes and you&apos;re out!</p>
        {currentInput && <p>Last typed: {currentInput}</p>}
      </div>
    </ModalWrapper>
  )
} 