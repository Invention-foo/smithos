import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { ModalWrapper } from "@/components/modal-wrapper"

interface CodeCrashProps {
  onClose: () => void
}

interface Player {
  y: number
  velocity: number
}

interface Obstacle {
  id: number
  x: number
  gapPosition: number
  passed: boolean
}

export function CodeCrash({ onClose }: CodeCrashProps) {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState<Player>({ y: 150, velocity: 0 })
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  
  const frameRef = useRef<number>()
  const lastObstacleRef = useRef<number>(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  
  const gameAreaWidth = 400
  const gameAreaHeight = 300
  const playerSize = 20
  const gravity = 0.4
  const jumpStrength = -7
  const obstacleWidth = 40
  const gapHeight = 120
  const obstacleSpeed = 2

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("codeCrashHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore, 10))
    }
  }, [])

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("codeCrashHighScore", score.toString())
    }
  }, [score, highScore])

  // Handle keyboard input and mouse/touch input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        handleJump()
      }
    }

    const handleClick = () => {
      handleJump()
    }

    window.addEventListener('keydown', handleKeyPress)
    if (gameAreaRef.current) {
      gameAreaRef.current.addEventListener('click', handleClick)
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (gameAreaRef.current) {
        gameAreaRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [gameStarted, gameOver])

  const handleJump = () => {
    if (!gameStarted && !gameOver) {
      // Start the game immediately with the first jump
      setGameStarted(true)
      setPlayer(prev => ({
        ...prev,
        velocity: jumpStrength
      }))
    } else if (gameStarted && !gameOver) {
      setPlayer(prev => ({
        ...prev,
        velocity: jumpStrength
      }))
    } else if (gameOver) {
      resetGame()
    }
  }

  // Initialize first obstacle
  useEffect(() => {
    if (gameStarted && obstacles.length === 0) {
      setObstacles([{
        id: Date.now(),
        x: gameAreaWidth + 100, // Start a bit further to give player time
        gapPosition: (gameAreaHeight - gapHeight) / 2,
        passed: false
      }])
      lastObstacleRef.current = Date.now()
    }
  }, [gameStarted, obstacles.length, gameAreaHeight, gapHeight, gameAreaWidth])

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = () => {
        // Update player position
        setPlayer(prev => {
          const newVelocity = prev.velocity + gravity
          const newY = prev.y + newVelocity
          
          // Check if player hits the boundaries
          if (newY < 0 || newY > gameAreaHeight - playerSize) {
            setGameOver(true)
            return prev
          }
          
          return {
            y: newY,
            velocity: newVelocity
          }
        })
        
        // Update obstacles
        setObstacles(prev => {
          // Move obstacles
          const updatedObstacles = prev.map(obstacle => ({
            ...obstacle,
            x: obstacle.x - obstacleSpeed
          }))
          
          // Remove obstacles that are off-screen
          const filteredObstacles = updatedObstacles.filter(obstacle => obstacle.x > -obstacleWidth)
          
          // Check for collisions
          filteredObstacles.forEach(obstacle => {
            // Check if player is at the obstacle's x position
            if (obstacle.x < 50 + playerSize && obstacle.x + obstacleWidth > 50) {
              // Check if player is within the gap
              const isInGap = player.y > obstacle.gapPosition && 
                              player.y + playerSize < obstacle.gapPosition + gapHeight
              
              if (!isInGap) {
                setGameOver(true)
              } else if (!obstacle.passed && obstacle.x + obstacleWidth < 50) {
                // Player passed the obstacle
                setScore(s => s + 1)
                obstacle.passed = true
              }
            }
          })
          
          // Add new obstacles
          const now = Date.now()
          if (now - lastObstacleRef.current > 2000) {
            lastObstacleRef.current = now
            filteredObstacles.push({
              id: now,
              x: gameAreaWidth,
              gapPosition: Math.max(20, Math.min(gameAreaHeight - gapHeight - 20, 
                Math.random() * (gameAreaHeight - gapHeight))),
              passed: false
            })
          }
          
          return filteredObstacles
        })
        
        frameRef.current = requestAnimationFrame(gameLoop)
      }
      
      frameRef.current = requestAnimationFrame(gameLoop)
      
      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
      }
    }
  }, [gameStarted, gameOver, player.y])

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setPlayer({ y: 150, velocity: 0 })
    setObstacles([])
    lastObstacleRef.current = 0
  }

  return (
    <ModalWrapper onClose={onClose} className="p-6 rounded-lg w-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">Code Crash</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-green-300 mb-2">Score: {score}</p>
        <p className="text-green-300 mb-2">High Score: {highScore}</p>
      </div>

      <div 
        ref={gameAreaRef}
        className="relative bg-black border border-green-500 mx-auto overflow-hidden cursor-pointer"
        style={{ width: gameAreaWidth, height: gameAreaHeight }}
      >
        {/* Matrix code background effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute text-green-500 text-xs"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.5
              }}
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j}>
                  {String.fromCharCode(Math.floor(Math.random() * 26) + 97)}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Player */}
        <div
          className="absolute bg-green-500 rounded-sm z-10"
          style={{
            left: 50,
            top: player.y,
            width: playerSize,
            height: playerSize,
            transition: 'transform 0.1s',
            transform: `rotate(${player.velocity * 3}deg)`
          }}
        >
          <span className="text-black font-bold text-xs flex items-center justify-center h-full">
            λ
          </span>
        </div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div key={obstacle.id}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-700 border-r-2 border-l-2 border-green-300"
              style={{
                left: obstacle.x,
                top: 0,
                width: obstacleWidth,
                height: obstacle.gapPosition,
              }}
            >
              <div className="absolute bottom-0 w-full h-6 bg-green-600 border-t-2 border-green-300"></div>
            </div>
            
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-700 border-r-2 border-l-2 border-green-300"
              style={{
                left: obstacle.x,
                top: obstacle.gapPosition + gapHeight,
                width: obstacleWidth,
                height: gameAreaHeight - (obstacle.gapPosition + gapHeight),
              }}
            >
              <div className="absolute top-0 w-full h-6 bg-green-600 border-b-2 border-green-300"></div>
            </div>
          </div>
        ))}
        
        {/* Start message */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <p className="text-green-300 text-lg">Click or Press Space to Start</p>
          </div>
        )}
        
        {/* Game over message */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
            <div className="text-center">
              <p className="text-red-500 text-xl mb-4">Game Over!</p>
              <p className="text-green-300 mb-4">Score: {score}</p>
              <button 
                onClick={resetGame}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-4 text-green-300">
        <p>Click or press Space to jump!</p>
        <p>Navigate through the obstacles without crashing.</p>
      </div>
    </ModalWrapper>
  )
} 