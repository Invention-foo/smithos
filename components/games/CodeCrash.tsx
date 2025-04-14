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
  gapHeight: number
  passed: boolean
  type: 'normal' | 'double'
  secondGapPosition?: number
  positionType?: string
}

export function CodeCrash({ onClose }: CodeCrashProps) {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState<Player>({ y: 150, velocity: 0 })
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [gameTime, setGameTime] = useState(0)
  
  const frameRef = useRef<number>()
  const lastObstacleRef = useRef<number>(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameStartTimeRef = useRef<number>(0)
  const firstObstacleGeneratedRef = useRef<boolean>(false)
  
  const gameAreaWidth = 400
  const gameAreaHeight = 300
  const playerSize = 20
  const gravity = 0.4
  const jumpStrength = -7
  const obstacleWidth = 40
  const baseGapHeight = 120
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
      console.log(`[${getElapsedTime()}ms] New high score: ${score}`)
    }
  }, [score, highScore])

  // Get elapsed time since game start
  const getElapsedTime = (): number => {
    if (!gameStartTimeRef.current) return 0
    return Date.now() - gameStartTimeRef.current
  }

  // Handle keyboard input and mouse/touch input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        console.log(`[${getElapsedTime()}ms] User pressed space`)
        handleJump()
      }
    }

    const handleClick = () => {
      console.log(`[${getElapsedTime()}ms] User clicked`)
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
      gameStartTimeRef.current = Date.now()
      console.log(`[0ms] Game started`)
      setGameStarted(true)
      setPlayer(prev => {
        console.log(`[0ms] Player jumped from y=${prev.y} with velocity=${jumpStrength}`)
        return {
          ...prev,
          velocity: jumpStrength
        }
      })
    } else if (gameStarted && !gameOver) {
      setPlayer(prev => {
        console.log(`[${getElapsedTime()}ms] Player jumped from y=${prev.y} with velocity=${jumpStrength}`)
        return {
          ...prev,
          velocity: jumpStrength
        }
      })
    } else if (gameOver) {
      console.log(`[${getElapsedTime()}ms] Game reset`)
      resetGame()
    }
  }

  // Generate a new obstacle with varied gap positions
  const generateObstacle = (isFirst = false): Obstacle => {
    // Define the possible gap positions
    const gapHeight = baseGapHeight;
    const minGapPos = 20;
    const maxGapPos = gameAreaHeight - gapHeight - 20;
    
    // Create varied gap positions
    let gapPosition;
    let positionType = "";
    
    if (isFirst) {
      // First obstacle is always in the middle
      positionType = "Middle";
      gapPosition = (gameAreaHeight - gapHeight) / 2;
      
      console.log(`[${getElapsedTime()}ms] Generated first obstacle: 
        - Position: ${positionType} (y=${gapPosition.toFixed(1)})
        - Gap height: ${gapHeight}
        - Distance: 500`);
      
      return {
        id: Date.now(),
        x: gameAreaWidth + 100, // Start a bit further away
        gapPosition,
        gapHeight,
        passed: false,
        type: 'normal',
        positionType
      };
    } else {
      // Determine gap position based on patterns
      const positionTypeIndex = Math.floor(Math.random() * 5);
      
      switch (positionTypeIndex) {
        case 0: // Very high
          positionType = "Very high";
          gapPosition = minGapPos + Math.random() * 40;
          break;
        case 1: // High
          positionType = "High";
          gapPosition = minGapPos + 40 + Math.random() * 40;
          break;
        case 2: // Middle
          positionType = "Middle";
          gapPosition = (gameAreaHeight - gapHeight) / 2 - 20 + Math.random() * 40;
          break;
        case 3: // Low
          positionType = "Low";
          gapPosition = maxGapPos - 80 + Math.random() * 40;
          break;
        case 4: // Very low
          positionType = "Very low";
          gapPosition = maxGapPos - 40 + Math.random() * 40;
          break;
        default:
          positionType = "Middle";
          gapPosition = (gameAreaHeight - gapHeight) / 2;
      }
      
      // Ensure gap position is within bounds
      gapPosition = Math.max(minGapPos, Math.min(maxGapPos, gapPosition));
      
      // Determine if this will be a double obstacle (about 20% chance after score > 5)
      const isDouble = score > 5 && Math.random() < 0.2;
      
      if (isDouble) {
        // Make sure the second gap is in a different position than the first
        let secondGapPosition;
        let secondPositionType;
        
        if (gapPosition < gameAreaHeight / 2) {
          // If first gap is in upper half, put second gap in lower half
          secondPositionType = "Lower half";
          secondGapPosition = gameAreaHeight / 2 + Math.random() * (maxGapPos - gameAreaHeight / 2);
        } else {
          // If first gap is in lower half, put second gap in upper half
          secondPositionType = "Upper half";
          secondGapPosition = minGapPos + Math.random() * (gameAreaHeight / 2 - minGapPos);
        }
        
        console.log(`[${getElapsedTime()}ms] Generated DOUBLE obstacle: 
          - Position type: ${positionType} (y=${gapPosition.toFixed(1)})
          - Second gap: ${secondPositionType} (y=${secondGapPosition.toFixed(1)})
          - Gap height: ${gapHeight}
          - Score: ${score}`);
        
        return {
          id: Date.now(),
          x: gameAreaWidth,
          gapPosition,
          gapHeight,
          passed: false,
          type: 'double',
          secondGapPosition,
          positionType
        };
      } else {
        console.log(`[${getElapsedTime()}ms] Generated obstacle: 
          - Position type: ${positionType} (y=${gapPosition.toFixed(1)})
          - Gap height: ${gapHeight}
          - Score: ${score}`);
        
        return {
          id: Date.now(),
          x: gameAreaWidth,
          gapPosition,
          gapHeight,
          passed: false,
          type: 'normal',
          positionType
        };
      }
    }
  };

  // Remove the separate obstacle generation useEffect and integrate it into the game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    let lastTime = performance.now(); // Use performance.now() for more precise timing
    let lastObstacleTime = lastTime;
    const obstacleInterval = 2000; // Base interval in milliseconds
    
    const gameLoop = (timestamp: DOMHighResTimeStamp) => {
      if (!gameStartTimeRef.current) {
        gameStartTimeRef.current = performance.now();
        lastTime = gameStartTimeRef.current;
        lastObstacleTime = lastTime;
        
        // Generate first obstacle immediately
        if (obstacles.length === 0) {
          const firstObstacle = generateObstacle(true);
          console.log(`[${getElapsedTime()}ms] Adding first obstacle`);
          setObstacles([firstObstacle]);
        }
      }
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Update game time (fix negative time issue)
      setGameTime(Math.max(0, performance.now() - gameStartTimeRef.current));
      
      // Check if it's time to generate a new obstacle
      if (timestamp - lastObstacleTime >= obstacleInterval) {
        const newObstacle = generateObstacle();
        console.log(`[${getElapsedTime()}ms] Adding new obstacle, current count: ${obstacles.length}`);
        setObstacles(prevObstacles => {
          // Only add new obstacle if we don't have too many
          if (prevObstacles.length < 5) { // Limit max obstacles
            return [...prevObstacles, newObstacle];
          }
          return prevObstacles;
        });
        lastObstacleTime = timestamp;
      }
      
      // Update player position with deltaTime
      setPlayer(prev => {
        const newVelocity = prev.velocity + (gravity * deltaTime / 16); // Scale gravity with deltaTime
        const newY = prev.y + (newVelocity * deltaTime / 16); // Scale movement with deltaTime
        
        // Check for collision with boundaries
        if (newY < 0 || newY + playerSize > gameAreaHeight) {
          console.log(`[${getElapsedTime()}ms] Game over: Player hit boundary at y=${newY}`);
          setGameOver(true);
          return prev;
        }
        
        return {
          y: newY,
          velocity: newVelocity
        };
      });
      
      // Update obstacles and check for collisions
      setObstacles(prevObstacles => {
        // Move obstacles
        const updatedObstacles = prevObstacles.map(obstacle => {
          // Calculate movement based on deltaTime for smoother motion
          const moveAmount = (obstacleSpeed * deltaTime) / 16; // Normalize to ~60fps
          const newX = obstacle.x - moveAmount;
          
          // Only check for passing if the obstacle hasn't been passed yet
          if (!obstacle.passed && newX + obstacleWidth < 50) {
            // Ensure we only count each obstacle once
            if (!obstacle.passed) {
              console.log(`[${getElapsedTime()}ms] Player passed obstacle (${obstacle.positionType}), new score: ${score + 1}`);
              setScore(prev => prev + 1);
            }
            return { ...obstacle, x: newX, passed: true };
          }
          
          // Check for collision with obstacle
          if (50 + playerSize > newX && 50 < newX + obstacleWidth) {
            const playerTop = player.y;
            const playerBottom = player.y + playerSize;
            
            let collision = false;
            
            // Check if player is within the gap
            const inFirstGap = playerTop >= obstacle.gapPosition && playerBottom <= obstacle.gapPosition + obstacle.gapHeight;
            
            if (obstacle.type === 'normal') {
              collision = !inFirstGap;
            } else if (obstacle.type === 'double' && obstacle.secondGapPosition) {
              const inSecondGap = playerTop >= obstacle.secondGapPosition && playerBottom <= obstacle.secondGapPosition + obstacle.gapHeight;
              collision = !inFirstGap && !inSecondGap;
            }
            
            if (collision) {
              console.log(`[${getElapsedTime()}ms] Game over: Collision detected
                - Player position: y=${player.y}
                - Obstacle position: x=${newX}, gap at y=${obstacle.gapPosition}
                - Obstacle type: ${obstacle.type}
                - Score: ${score}`);
              setGameOver(true);
            }
          }
          
          return { ...obstacle, x: newX };
        });
        
        // Remove obstacles that are off-screen
        return updatedObstacles.filter(obstacle => obstacle.x > -obstacleWidth);
      });
      
      if (!gameOver) {
        frameRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    frameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameStarted, gameOver, score]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setPlayer({ y: 150, velocity: 0 });
    setObstacles([]);
    setGameTime(0);
    lastObstacleRef.current = 0;
    gameStartTimeRef.current = 0;
    firstObstacleGeneratedRef.current = false;
  };

  // Render obstacle
  const renderObstacle = (obstacle: Obstacle) => {
    const baseClasses = "absolute border-r-2 border-l-2 border-green-300 bg-green-700";
    
    return (
      <div key={obstacle.id}>
        {/* Top pipe */}
        <div
          className={baseClasses}
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
          className={baseClasses}
          style={{
            left: obstacle.x,
            top: obstacle.gapPosition + obstacle.gapHeight,
            width: obstacleWidth,
            height: gameAreaHeight - (obstacle.gapPosition + obstacle.gapHeight),
          }}
        >
          <div className="absolute top-0 w-full h-6 bg-green-600 border-b-2 border-green-300"></div>
        </div>
        
        {/* For double obstacles, render the second gap */}
        {obstacle.type === 'double' && obstacle.secondGapPosition && (
          <>
            {/* Middle pipe */}
            <div
              className={baseClasses}
              style={{
                left: obstacle.x,
                top: obstacle.gapPosition + obstacle.gapHeight,
                width: obstacleWidth,
                height: obstacle.secondGapPosition - (obstacle.gapPosition + obstacle.gapHeight),
              }}
            >
              <div className="absolute bottom-0 w-full h-6 bg-green-600 border-t-2 border-green-300"></div>
              <div className="absolute top-0 w-full h-6 bg-green-600 border-b-2 border-green-300"></div>
            </div>
            
            {/* Bottom pipe after second gap */}
            <div
              className={baseClasses}
              style={{
                left: obstacle.x,
                top: obstacle.secondGapPosition + obstacle.gapHeight,
                width: obstacleWidth,
                height: gameAreaHeight - (obstacle.secondGapPosition + obstacle.gapHeight),
              }}
            >
              <div className="absolute top-0 w-full h-6 bg-green-600 border-b-2 border-green-300"></div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Debug function to show obstacle data
  const debugObstacles = () => {
    return obstacles.map((o, i) => (
      <div key={i} className="text-xs">
        #{i}: x={Math.round(o.x)}, type={o.positionType}, passed={o.passed.toString()}
      </div>
    ));
  };

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
        <p className="text-green-300 mb-2">Time: {Math.floor(gameTime / 1000)}s</p>
        <p className="text-green-300 mb-2">Obstacles: {obstacles.length}</p>
        <div className="text-green-300 mb-2 text-xs">
          <details>
            <summary>Debug: Obstacle Data</summary>
            {debugObstacles()}
          </details>
        </div>
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
        {obstacles.map(renderObstacle)}
        
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
        <p className="mt-2 text-xs">Check the browser console for detailed game logs</p>
      </div>
    </ModalWrapper>
  )
} 