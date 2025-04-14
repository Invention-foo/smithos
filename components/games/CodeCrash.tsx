import { useState, useEffect, useRef } from "react"
import { X, Copy } from "lucide-react"
import { ModalWrapper } from "@/components/modal-wrapper"
import { createGameSession, updateGameSession } from "@/app/actions"

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
  speed: number
}

// Add these types at the top
type LogEntry = {
  timestamp: number;
  message: string;
  data?: any;
};

export function CodeCrash({ onClose }: CodeCrashProps) {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState<Player>({ y: 150, velocity: 0 })
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [gameTime, setGameTime] = useState(0)
  const [sessionId, setSessionId] = useState<string>('')
  const [previousSession, setPreviousSession] = useState<{ id: string; score: number } | null>(null)
  const [sessionLogs, setSessionLogs] = useState<LogEntry[]>([])
  
  const frameRef = useRef<number>()
  const lastObstacleRef = useRef<number>(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameStartTimeRef = useRef<number>(0)
  const firstObstacleGeneratedRef = useRef<boolean>(false)
  
  const gameAreaWidth = 400
  const gameAreaHeight = 300
  const playerSize = 20
  const PHYSICS_STEP = 1000 / 60; // 60 FPS physics update
  const MAX_VELOCITY = 15; // Cap the maximum velocity
  const gravity = 0.5;  // Smaller gravity value
  const jumpStrength = -8;  // Adjusted jump strength
  const obstacleWidth = 40
  const baseGapHeight = 120
  const obstacleSpeed = 4
  const MIN_OBSTACLE_INTERVAL = 400; // Reduced to 0.4s
  const MAX_OBSTACLE_INTERVAL = 2000; // Keep max at 2s

  // At the top of the component, add a ref to track physics state
  const physicsStateRef = useRef({ y: 150, velocity: 0 });

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

  // Modify the session ID generation to be 8 characters
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Add logging function
  const logGameEvent = (message: string, data?: any) => {
    const timestamp = getElapsedTime();
    const logEntry: LogEntry = {
      timestamp,
      message,
      ...(data && { data })
    };
    
    // Keep existing console.log for now
    console.log(`[${timestamp}ms] ${message}`, data ? data : '');
    
    // Add to structured logs
    setSessionLogs(prev => [...prev, logEntry]);
  };

  // Modify handleJump to create session
  const handleJump = async () => {
    if (!gameStarted && !gameOver) {
      gameStartTimeRef.current = Date.now();
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      setSessionLogs([]); // Clear logs for new session
      
      // Create new session in database
      await createGameSession({
        session_id: newSessionId,
        game_id: 'CODECRASH',
        session_start: new Date().toISOString()
      });
      
      logGameEvent('Game started', { sessionId: newSessionId });
      setGameStarted(true);
      physicsStateRef.current.velocity = jumpStrength;
      setPlayer(prev => ({
        ...prev,
        velocity: jumpStrength
      }));
    } else if (gameStarted && !gameOver) {
      logGameEvent('Player jumped', {
        position: physicsStateRef.current.y,
        newVelocity: jumpStrength
      });
      physicsStateRef.current.velocity = jumpStrength;
      setPlayer(prev => ({
        ...prev,
        velocity: jumpStrength
      }));
    }
  };

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
      positionType = "Middle";
      gapPosition = (gameAreaHeight - gapHeight) / 2;
      
      logGameEvent('Generated first obstacle', {
        position: {
          type: positionType,
          y: gapPosition
        },
        gapHeight,
        distance: 500
      });
      
      return {
        id: Date.now(),
        x: gameAreaWidth + 100,
        gapPosition,
        gapHeight,
        passed: false,
        type: 'normal',
        positionType,
        speed: obstacleSpeed + (Math.random() * 0.5) // Add slight speed variation
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
        
        logGameEvent('Generated double obstacle', {
          position: {
            type: positionType,
            y: gapPosition,
            secondType: secondPositionType,
            secondY: secondGapPosition
          },
          gapHeight,
          score
        });
        
        return {
          id: Date.now(),
          x: gameAreaWidth,
          gapPosition,
          gapHeight,
          passed: false,
          type: 'double',
          secondGapPosition,
          positionType,
          speed: obstacleSpeed + (Math.random() * 0.5) // Add slight speed variation
        };
      } else {
        logGameEvent('Generated obstacle', {
          position: {
            type: positionType,
            y: gapPosition
          },
          gapHeight,
          score
        });
        
        return {
          id: Date.now(),
          x: gameAreaWidth,
          gapPosition,
          gapHeight,
          passed: false,
          type: 'normal',
          positionType,
          speed: obstacleSpeed + (Math.random() * 0.5) // Add slight speed variation
        };
      }
    }
  };

  // Remove the separate obstacle generation useEffect and integrate it into the game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    let lastTime = performance.now();
    let accumulator = 0;
    let lastObstacleTime = lastTime;
    
    // Initialize physics state from current player state
    physicsStateRef.current = {
      y: player.y,
      velocity: player.velocity
    };
    
    const gameLoop = (timestamp: DOMHighResTimeStamp) => {
      const frameTime = Math.min(timestamp - lastTime, 50);
      lastTime = timestamp;
      accumulator += frameTime;
      
      while (accumulator >= PHYSICS_STEP) {
        // Log the current state before update
        // console.log(`[${getElapsedTime()}ms] Physics update:
        //   Previous: y=${physicsStateRef.current.y.toFixed(1)}, v=${physicsStateRef.current.velocity.toFixed(1)}
        //   Time step: ${PHYSICS_STEP}ms`);

        // Update physics state using the ref
        physicsStateRef.current.velocity = Math.min(MAX_VELOCITY, physicsStateRef.current.velocity + gravity);
        physicsStateRef.current.y = physicsStateRef.current.y + physicsStateRef.current.velocity;

        // Log the result after update
        // console.log(`[${getElapsedTime()}ms] After physics:
        //   New: y=${physicsStateRef.current.y.toFixed(1)}, v=${physicsStateRef.current.velocity.toFixed(1)}`);

        if (physicsStateRef.current.y < 0 || physicsStateRef.current.y + playerSize > gameAreaHeight) {
          console.log(`[${getElapsedTime()}ms] Game over: Player hit boundary at y=${physicsStateRef.current.y}`);
          setGameOver(true);
          return;
        }
        
        accumulator -= PHYSICS_STEP;
      }
      
      // Update React state from physics state
      setPlayer({
        y: physicsStateRef.current.y,
        velocity: physicsStateRef.current.velocity
      });
      
      // Update game time
      setGameTime(Math.max(0, performance.now() - gameStartTimeRef.current));
      
      // Check if it's time to generate a new obstacle
      if (timestamp - lastObstacleTime >= lastObstacleRef.current) {
        const newObstacle = generateObstacle();
        logGameEvent('Adding new obstacle', {
          interval: lastObstacleRef.current,
          count: obstacles.length
        });
        
        setObstacles(prevObstacles => {
          // Only add new obstacle if we don't have too many
          if (prevObstacles.length < 5) { // Limit max obstacles
            // Generate next interval for variety
            lastObstacleRef.current = MIN_OBSTACLE_INTERVAL + 
              Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL);
            return [...prevObstacles, newObstacle];
          }
          return prevObstacles;
        });
        lastObstacleTime = timestamp;
      }
      
      // Update obstacles and check for collisions
      setObstacles(prevObstacles => {
        // Move obstacles
        const updatedObstacles = prevObstacles.map(obstacle => {
          // Calculate movement based on deltaTime for smoother motion
          const moveAmount = (obstacle.speed * frameTime) / 16; // Use obstacle's individual speed
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
            // Use physics state for collision detection
            const playerTop = physicsStateRef.current.y;
            const playerBottom = physicsStateRef.current.y + playerSize;
            
            let collision = false;
            
            if (obstacle.type === 'normal') {
              const tolerance = 5;
              const hitTopPipe = playerTop < (obstacle.gapPosition - tolerance);
              const hitBottomPipe = playerBottom > (obstacle.gapPosition + obstacle.gapHeight + tolerance);
              collision = hitTopPipe || hitBottomPipe;
            } else if (obstacle.type === 'double' && obstacle.secondGapPosition) {
              const tolerance = 5;
              const hitTopPipe = playerTop < (obstacle.gapPosition - tolerance);
              const hitMiddlePipe = playerBottom > (obstacle.gapPosition + obstacle.gapHeight + tolerance) && 
                                   playerTop < (obstacle.secondGapPosition - tolerance);
              const hitBottomPipe = playerBottom > (obstacle.secondGapPosition + obstacle.gapHeight + tolerance);
              collision = hitTopPipe || hitMiddlePipe || hitBottomPipe;
            }
            
            if (collision) {
              // Create the collision log entry
              const collisionLog: LogEntry = {
                timestamp: getElapsedTime(),
                message: 'Collision detected',
                data: {
                  player: {
                    physics: {
                      y: physicsStateRef.current.y,
                      velocity: physicsStateRef.current.velocity
                    },
                    visual: {
                      y: player.y,
                      bounds: { top: playerTop, bottom: playerBottom }
                    }
                  },
                  obstacle: {
                    x: newX,
                    gap: {
                      start: obstacle.gapPosition,
                      end: obstacle.gapPosition + obstacle.gapHeight
                    },
                    type: obstacle.type
                  },
                  timing: {
                    frameTime,
                    accumulator
                  },
                  score
                }
              };

              // Update logs and then output the complete log
              setSessionLogs(prev => {
                const finalLogs = [...prev, collisionLog];
                
                // Update session in database with final logs
                updateGameSession({
                  session_id: sessionId,
                  score: score,
                  session_log: finalLogs,
                  session_end: new Date().toISOString()
                });
                
                console.log('Full session log:', finalLogs);
                return finalLogs;
              });
              
              if (sessionId) {
                setPreviousSession({ id: sessionId, score: score });
              }
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
    // Keep track of current session before reset
    if (sessionId) {
      setPreviousSession({ id: sessionId, score: score });
    }
    
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setPlayer({ y: 150, velocity: 0 });
    setObstacles([]);
    setGameTime(0);
    // Set initial obstacle interval
    lastObstacleRef.current = MIN_OBSTACLE_INTERVAL + 
      Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL);
    gameStartTimeRef.current = 0;
    firstObstacleGeneratedRef.current = false;
  };

  // Render obstacle
  const renderObstacle = (obstacle: Obstacle) => {
    const baseClasses = "absolute border-r-2 border-l-2 border-green-300 bg-green-700";
    
    return (
      <div key={obstacle.id}>
        {/* Collision boundaries visualization */}
        <div className="absolute border-2 border-red-500/20" style={{
          left: obstacle.x,
          top: 0,
          width: obstacleWidth,
          height: gameAreaHeight,
          pointerEvents: 'none',
        }}>
          {/* Safe zone (gap) */}
          <div className="absolute border-2 border-green-500/50" style={{
            top: obstacle.gapPosition,
            width: '100%',
            height: obstacle.gapHeight,
          }} />
        </div>

        {/* Visual pipes with restored appearance */}
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
      </div>
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here if you want
      console.log(`Copied to clipboard: ${text}`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
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
        {sessionId && (
          <div className="flex items-center justify-center gap-2 text-green-300/50 text-xs mb-2">
            <p>Session ID: {sessionId}</p>
            <button 
              onClick={() => copyToClipboard(sessionId)}
              className="p-1 hover:bg-green-800/30 rounded"
              title="Copy session ID"
            >
              <Copy size={12} />
            </button>
          </div>
        )}
        {previousSession && (
          <div className="flex items-center justify-center gap-2 text-green-300/30 text-xs mb-2">
            <p>Previous Session ID: {previousSession.id} (Score: {previousSession.score})</p>
            <button 
              onClick={() => copyToClipboard(previousSession.id)}
              className="p-1 hover:bg-green-800/30 rounded"
              title="Copy previous session ID"
            >
              <Copy size={12} />
            </button>
          </div>
        )}
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

        {/* Enhanced debug visualization */}
        {/* <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {/* Y-axis ruler */}
          {/* {Array.from({ length: 30 }).map((_, i) => (
            <div key={`ruler-${i * 10}`} className="relative border-t border-gray-500/20">
              <span className="absolute left-0 text-[8px] text-gray-500/50">{i * 10}px</span>
            </div>
          ))} */}
          
          {/* Player bounds */}
          {/* <div 
            className="absolute left-0 w-full border-t border-red-500/50" 
            style={{ top: player.y }}>
            <span className="text-[8px] text-red-500/50">Player top: {Math.round(player.y)}px</span>
          </div>
          <div 
            className="absolute left-0 w-full border-t border-red-500/50" 
            style={{ top: player.y + playerSize }}>
            <span className="text-[8px] text-red-500/50">Player bottom: {Math.round(player.y + playerSize)}px</span>
          </div> */}
          
          {/* Obstacle bounds */}
          {/* {obstacles.map(obstacle => (
            <div key={`debug-${obstacle.id}`}>
              <div 
                className="absolute left-0 w-full border-t border-blue-500/50" 
                style={{ top: obstacle.gapPosition }}>
                <span className="text-[8px] text-blue-500/50">Gap top: {Math.round(obstacle.gapPosition)}px</span>
              </div>
              <div 
                className="absolute left-0 w-full border-t border-blue-500/50" 
                style={{ top: obstacle.gapPosition + obstacle.gapHeight }}>
                <span className="text-[8px] text-blue-500/50">Gap bottom: {Math.round(obstacle.gapPosition + obstacle.gapHeight)}px</span>
              </div>
            </div>
          ))} */}
        {/* </div> */}
      </div>

      <div className="text-center mt-4 text-green-300">
        <p>Click or press Space to jump!</p>
        <p>Navigate through the obstacles without crashing.</p>
        <p className="mt-2 text-xs">Check the browser console for detailed game logs</p>
      </div>
    </ModalWrapper>
  )
} 