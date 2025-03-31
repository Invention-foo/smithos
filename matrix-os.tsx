"use client"

import { useState, useEffect, useRef } from "react"
import { useWallet } from "@/hooks/use-wallet"
import {
  Monitor,
  Folder,
  TerminalIcon,
  MessageCircle,
  Twitter,
  Power,
  BarChart2,
  Code,
  Shield,
  Search,
  ChevronRight,
  Gamepad2,
  X,
  Pill,
  PieChart,
} from "lucide-react"
import { BootSequence } from "./boot-sequence"
import { AgentSmith } from "./agent-smith"
import { MatrixRain, type MatrixRainRef } from "./matrix-rain"
import { SettingsMenu } from "@/components/settings-menu"
import { Terminal } from "./components/terminal"
import { SystemInfoPopup } from "@/components/system-info-popup"
import { DocumentsModal } from "@/components/documents-modal"
import { TokenHoldings } from "./components/token-holdings"
import { Dashboard } from "./components/dashboard"
import { NeuralScan } from "./components/neural-scan"
import { CodeSeer } from "@/components/code-seer"
import { NeoGuard } from "./components/neo-guard"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { hexToRgb } from "@/hooks/useThemeColor"
import { connectWallet } from "@/lib/wallet"
import { MenuWrapper } from '@/components/menu-wrapper'
import { RedPillBluePill } from "@/components/games/RedPillBluePill"
import { ModalWrapper } from '@/components/modal-wrapper'
import { CodeRain } from "@/components/games/CodeRain"
import Clock from "./components/Clock"
import { Tokenomics } from "./components/tokenomics"


export default function MatrixOS() {
  const [bootState, setBootState] = useState<
    "booting" | "agent-smith" | "matrix-rain" | "os" | "shutdown" | "powered-off"
  >("booting")
  const [osOpacity, setOsOpacity] = useState(0)
  const [isMatrixRainFadingOut, setIsMatrixRainFadingOut] = useState(false)
  const matrixRainRef = useRef<MatrixRainRef>(null)

  useEffect(() => {
    if (bootState === "matrix-rain") {
      const timer = setTimeout(() => {
        setIsMatrixRainFadingOut(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [bootState])

  useEffect(() => {
    if (isMatrixRainFadingOut) {
      const timer = setTimeout(() => {
        setBootState("os")
        fadeInOS()
        setIsMatrixRainFadingOut(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isMatrixRainFadingOut])

  const handleMatrixRainComplete = () => {
    setBootState("os")
  }

  const handleShutdown = () => {
    setBootState("shutdown")
  }

  const handleShutdownComplete = () => {
    setBootState("powered-off")
  }

  const handleRestart = () => {
    setBootState("booting")
  }

  const fadeInOS = () => {
    const fadeInInterval = setInterval(() => {
      setOsOpacity((prevOpacity) => {
        const newOpacity = prevOpacity + 0.05
        if (newOpacity >= 1) {
          clearInterval(fadeInInterval)
          return 1
        }
        return newOpacity
      })
    }, 50)
  }

  return (
    <div className="bg-black min-h-screen">
      {bootState === "booting" && <BootSequence onComplete={() => setBootState("agent-smith")} />}
      {bootState === "agent-smith" && (
        <AgentSmith 
          onComplete={() => setBootState("matrix-rain")} 
          onSkip={() => {
            setBootState("os")
            fadeInOS()
          }} 
        />
      )}
      {bootState === "matrix-rain" && <MatrixRain ref={matrixRainRef} isFadingOut={isMatrixRainFadingOut} />}
      {bootState === "os" && (
        <MainOS
          opacity={osOpacity}
          onShutdown={handleShutdown}
        />
      )}
      {bootState === "shutdown" && <ShutdownEffect onComplete={handleShutdownComplete} />}
      {bootState === "powered-off" && <PoweredOff onRestart={handleRestart} />}
    </div>
  )
}

function MainOS({
  opacity,
  onShutdown,
}: {
  opacity: number
  onShutdown: () => void
}) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showProgramsMenu, setShowProgramsMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showSystemInfo, setShowSystemInfo] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showTokenHoldings, setShowTokenHoldings] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showNeuralScan, setShowNeuralScan] = useState(false)
  const [showCodeSeer, setShowCodeSeer] = useState(false)
  const [showNeoGuard, setShowNeoGuard] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showTokenomics, setShowTokenomics] = useState(false)
  const [showRedPillBluePill, setShowRedPillBluePill] = useState(false)
  const [showCodeRain, setShowCodeRain] = useState(false)
  const { isConnected: isWalletConnected, address } = useWallet()
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const programsButtonRef = useRef<HTMLButtonElement>(null)

  const handleWalletClick = async () => {
    if (isWalletConnected) {
      setShowTokenHoldings(true)
    } else {
      await connectWallet()
    }
  }

  const handleMouseLeave = () => {
    setShowProgramsMenu(false)
  }

  const handleCloseGame = () => {
    setShowRedPillBluePill(false)
    setShowCodeRain(false)
    setShowGames(false)
  }

  return (
    <div className="bg-black text-green-500 min-h-screen font-mono relative overflow-hidden" style={{ opacity }}>
      <div className="absolute inset-0 matrix-bg"></div>
      
      <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
        <div className="text-green-400/70 text-2xl font-bold tracking-wider animate-pulse-glow">
          Agent $SMITH by Virtuals - 0x991ab5d07F28232EC1677e2c13239fB9b4B9CcB7
          <br />
        </div>
      </div>

      <div className="relative z-10">
        {/* Desktop Icons */}
        <div className="p-2 grid grid-cols-4 gap-4">
          {/* Top Left - Interactive Programs */}
          <div className="col-span-2 grid grid-cols-2 gap-1 w-48">
            <DesktopIcon icon={<TerminalIcon />} label="Terminal" onClick={() => setShowTerminal(true)} />
            <DesktopIcon icon={<BarChart2 />} label="Dashboard" onClick={() => setShowDashboard(true)} />
            <DesktopIcon icon={<Code />} label="CodeSeer" onClick={() => setShowCodeSeer(true)} />
            <DesktopIcon icon={<Shield />} label="NeoGuard" onClick={() => setShowNeoGuard(true)} />
            <DesktopIcon icon={<Search />} label="NeuralScan" onClick={() => setShowNeuralScan(true)} />
          </div>

          {/* Top Right - System Folders */}
          <div className="col-start-4 flex flex-col items-end">
            <DesktopIcon icon={<Monitor />} label="This Computer" onClick={() => setShowSystemInfo(true)} />
            <DesktopIcon icon={<Folder />} label="Documents" onClick={() => setShowDocuments(true)} />
            <DesktopIcon icon={<Gamepad2 />} label="Games" onClick={() => setShowGames(true)} />
            <DesktopIcon icon={<PieChart />} label="Tokenomics" onClick={() => setShowTokenomics(true)} />
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="fixed bottom-14 right-0 flex space-x-4 p-2 mr-4">
          <DesktopIcon 
            icon={<MessageCircle />} 
            label="Telegram" 
            onClick={() => window.open('https://t.me/SmithDotBase', '_blank')}
          />
          <DesktopIcon 
            icon={<Twitter />} 
            label="Twitter" 
            onClick={() => window.open('https://x.com/0xSmithAI', '_blank')}
          />
        </div>

        {/* Taskbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-green-900 p-2 flex justify-between items-center z-20">
          <button
            ref={startButtonRef}
            className="bg-green-700 hover:bg-green-600 text-green-100 px-4 py-2 rounded"
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            Start
          </button>

          {showStartMenu && (
            <MenuWrapper 
              onClose={() => {
                setShowStartMenu(false);
                setShowProgramsMenu(false);
              }}
              className="rounded-t-lg shadow-lg w-64 mb-2"
              triggerRef={startButtonRef}
            >
              <div className="py-2">
                <button 
                  ref={programsButtonRef}
                  className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700 rounded flex justify-between items-center group"
                  onMouseEnter={() => setShowProgramsMenu(true)}
                  onMouseLeave={handleMouseLeave}
                >
                  Programs
                  <ChevronRight className="h-4 w-4 text-green-400 group-hover:text-green-100" />
                </button>

                {showProgramsMenu && (
                  <div 
                    className="absolute left-full top-0 w-64 bg-green-900 border border-green-500 rounded-lg shadow-lg -mt-2"
                    onMouseEnter={() => setShowProgramsMenu(true)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-2">
                      <button
                        className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700"
                        onClick={() => {
                          setShowCodeSeer(true);
                          setShowStartMenu(false);
                        }}
                      >
                        CodeSeer
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700"
                        onClick={() => {
                          setShowNeuralScan(true);
                          setShowStartMenu(false);
                        }}
                      >
                        NeuralScan
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700"
                        onClick={() => {
                          setShowTokenomics(true);
                          setShowProgramsMenu(false);
                          setShowStartMenu(false);
                        }}
                      >
                        <div className="flex items-center">
                          <PieChart className="mr-2" size={16} />
                          Tokenomics
                        </div>
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700"
                        onClick={() => {
                          setShowNeoGuard(true);
                          setShowStartMenu(false);
                        }}
                      >
                        NeoGuard
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700"
                        onClick={() => {
                          setShowTerminal(true);
                          setShowStartMenu(false);
                        }}
                      >
                        Terminal
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700 rounded"
                  onClick={() => {
                    setShowSystemInfo(true);
                    setShowStartMenu(false);
                  }}
                >
                  System Info
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700 rounded"
                  onClick={() => {
                    setShowDocuments(true);
                    setShowStartMenu(false);
                  }}
                >
                  Documents
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-green-100 hover:bg-green-700 rounded"
                  onClick={() => {
                    setShowSettings(true);
                    setShowStartMenu(false);
                  }}
                >
                  Settings
                </button>
                <div className="border-t border-green-700 my-2" />
                <button 
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-green-700 rounded"
                  onClick={onShutdown}
                >
                  Shutdown
                </button>
              </div>
            </MenuWrapper>
          )}

          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 text-green-300 text-sm hover:text-green-100 transition-colors"
              onClick={handleWalletClick}
            >
              <span>SSH:</span>
              {isWalletConnected ? (
                <span>{`${address?.slice(0, 6)}....${address?.slice(-4)}`}</span>
              ) : (
                <span className="text-yellow-500">Connect Wallet</span>
              )}
            </button>
            <Clock />
          </div>
        </div>

        {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} />}
        {showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}
        {showSystemInfo && <SystemInfoPopup onClose={() => setShowSystemInfo(false)} />}
        {showDocuments && <DocumentsModal onClose={() => setShowDocuments(false)} />}
        {showTokenHoldings && isWalletConnected && (
          <TokenHoldings
            onClose={() => setShowTokenHoldings(false)}
          />
        )}
        {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
        {showNeuralScan && <NeuralScan onClose={() => setShowNeuralScan(false)} />}
        {showCodeSeer && <CodeSeer onClose={() => setShowCodeSeer(false)} />}
        {showNeoGuard && <NeoGuard onClose={() => setShowNeoGuard(false)} />}
        {showGames && (
          <GamesFolder 
            onClose={() => setShowGames(false)} 
            onOpenRedPillBluePill={() => setShowRedPillBluePill(true)}
            onOpenCodeRain={() => setShowCodeRain(true)}
            showRedPillBluePill={showRedPillBluePill}
            showCodeRain={showCodeRain}
          />
        )}
        {showRedPillBluePill && (
          <RedPillBluePill onClose={handleCloseGame} />
        )}
        {showCodeRain && (
          <CodeRain onClose={handleCloseGame} />
        )}
        {showTokenomics && <Tokenomics onClose={() => setShowTokenomics(false)} />}
      </div>
    </div>
  )
}

function ShutdownEffect({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { display } = useSettingsStore()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { r, g, b } = hexToRgb(display.themeColor)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 20)
    const rows = Math.floor(canvas.height / 20)
    const dissolveStates: number[][] = Array(columns)
      .fill(0)
      .map(() => Array(rows).fill(0))

    let opacity = 1
    let completed = 0
    const totalCells = columns * rows

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "15px monospace"

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
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
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
  }, [onComplete, display.themeColor])

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 bg-black" aria-label="Shutdown effect" />
}

function PoweredOff({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button
        onClick={onRestart}
        className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition-colors flex items-center"
      >
        <Power className="mr-2" />
        Power On
      </button>
    </div>
  )
}

function GamesFolder({ 
  onClose, 
  onOpenRedPillBluePill,
  onOpenCodeRain,
  showRedPillBluePill,
  showCodeRain,
}: { 
  onClose: () => void
  onOpenRedPillBluePill: () => void
  onOpenCodeRain: () => void
  showRedPillBluePill: boolean
  showCodeRain: boolean
}) {
  return (
    <ModalWrapper onClose={showRedPillBluePill || showCodeRain ? () => {} : onClose} className="p-6 rounded-lg w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">Games</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-2">
        <button
          onClick={onOpenRedPillBluePill}
          className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Pill className="mr-2" />
          Red Pill Blue Pill
        </button>
        <button
          onClick={onOpenCodeRain}
          className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Code className="mr-2" />
          Code Rain
        </button>
        {/* Add more game buttons here in the future */}
      </div>
    </ModalWrapper>
  )
}

interface DesktopIconProps {
  icon: React.ReactNode
  label: React.ReactNode
  onClick?: () => void
}

function DesktopIcon({ icon, label, onClick }: DesktopIconProps) {
  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer hover:bg-green-900 rounded w-20 h-20"
      onClick={onClick}
    >
      {icon}
      <div className="mt-1 text-xs text-center">{label}</div>
    </div>
  )
}

