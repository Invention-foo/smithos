"use client"

import { useState, useEffect, useRef } from "react"
import { useWallet } from "@/hooks/use-wallet"
import {
  Monitor,
  Folder,
  TerminalIcon,
  Clock,
  MessageCircle,
  Twitter,
  Power,
  BarChart2,
  Code,
  Shield,
  Search,
  Wallet
} from "lucide-react"
import { BootSequence } from "./boot-sequence"
import { AgentSmith } from "./agent-smith"
import { MatrixRain, type MatrixRainRef } from "./matrix-rain"
import { SettingsMenu } from "./settings-menu"
import { Terminal } from "./components/terminal"
import { SystemInfoPopup } from "./components/system-info-popup"
import { DocumentsModal } from "./components/documents-modal"
import { TokenHoldings } from "./components/token-holdings"
import { Dashboard } from "./components/dashboard"
import { NeuralScan } from "./components/neural-scan"
import { CodeSeer } from "./components/code-seer"
import { NeoGuard } from "./components/neo-guard"

const PLACEHOLDER_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"

export default function MatrixOS() {
  const [bootState, setBootState] = useState<
    "booting" | "agent-smith" | "matrix-rain" | "os" | "shutdown" | "powered-off"
  >("booting")
  const [osOpacity, setOsOpacity] = useState(0)
  const [isMatrixRainFadingOut, setIsMatrixRainFadingOut] = useState(false)
  const matrixRainRef = useRef<MatrixRainRef>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showTokenInsight, setShowTokenInsight] = useState(false)
  const [showNeuralScan, setShowNeuralScan] = useState(false)

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

  const handleConnect = () => {
    setIsWalletConnected(true)
    // In a real application, this would trigger a wallet connection process
    console.log("Connecting wallet...")
  }

  const handleDisconnect = () => {
    setIsWalletConnected(false)
    setShowTokenHoldings(false)
    // In a real application, this would trigger a wallet disconnection process
    console.log("Disconnecting wallet...")
  }

  return (
    <div className="bg-black min-h-screen">
      {bootState === "booting" && <BootSequence onComplete={() => setBootState("agent-smith")} />}
      {bootState === "agent-smith" && <AgentSmith onComplete={() => setBootState("matrix-rain")} />}
      {bootState === "matrix-rain" && <MatrixRain ref={matrixRainRef} isFadingOut={isMatrixRainFadingOut} />}
      {bootState === "os" && (
        <MainOS
          opacity={osOpacity}
          onShutdown={handleShutdown}
          isWalletConnected={isWalletConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
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
  isWalletConnected,
  onConnect,
  onDisconnect,
}: {
  opacity: number
  onShutdown: () => void
  isWalletConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
}) {
  const [time, setTime] = useState(new Date())
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showProgramsSubmenu, setShowProgramsSubmenu] = useState(false)
  const [showSystemInfo, setShowSystemInfo] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showTokenHoldings, setShowTokenHoldings] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showNeuralScan, setShowNeuralScan] = useState(false)
  const [showCodeSeer, setShowCodeSeer] = useState(false)
  const [showNeoGuard, setShowNeoGuard] = useState(false)
  const { connectWallet, isConnected } = useWallet()


  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const programs = [
    { icon: <TerminalIcon />, label: "Terminal", action: () => setShowTerminal(true) },
    { icon: <BarChart2 />, label: "Dashboard", action: () => setShowDashboard(true) },
    { icon: <Search />, label: "NeuralScan", action: () => setShowNeuralScan(true) },
    { icon: <Code />, label: "CodeSeer", action: () => setShowCodeSeer(true) },
    { icon: <Shield />, label: "NeoGuard", action: () => setShowNeoGuard(true) },
    { icon: <Wallet />, label: isConnected ? "Connected" : "Connect Wallet", action: () => connectWallet() },
  ]

  return (
    <div className="bg-black text-green-500 min-h-screen font-mono relative overflow-hidden" style={{ opacity }}>
      <div className="absolute inset-0 matrix-bg"></div>
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
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="fixed bottom-14 right-0 flex space-x-4 p-2 mr-4">
          <DesktopIcon icon={<MessageCircle />} label="Telegram" />
          <DesktopIcon icon={<Twitter />} label="Twitter" />
        </div>

        {/* Taskbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-green-900 p-2 flex justify-between items-center z-20">
          <button
            className="bg-green-700 hover:bg-green-600 text-black px-4 py-2 rounded"
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            Start
          </button>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 text-green-300 text-sm hover:text-green-100 transition-colors"
              onClick={() => (isWalletConnected ? setShowTokenHoldings(true) : onConnect())}
            >
              <span>SSH:</span>
              {isWalletConnected ? (
                <span>{`${PLACEHOLDER_WALLET.slice(0, 6)}....${PLACEHOLDER_WALLET.slice(-4)}`}</span>
              ) : (
                <span className="text-yellow-500">Disconnected</span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{time.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Start Menu */}
        {showStartMenu && (
          <div className="fixed bottom-12 left-0 w-64 bg-green-900 border border-green-500 p-4">
            <h2 className="text-xl mb-4">SmithOS</h2>
            <ul>
              <li
                className="mb-2 hover:bg-green-700 p-2 cursor-pointer relative"
                onMouseEnter={() => setShowProgramsSubmenu(true)}
                onMouseLeave={() => setShowProgramsSubmenu(false)}
              >
                Programs
                {showProgramsSubmenu && (
                  <div
                    className="absolute left-full bottom-0 w-48 bg-green-900 border border-green-500 p-2"
                    style={{ maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}
                  >
                    {programs.map((program, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-green-700 cursor-pointer flex items-center"
                        onClick={() => {
                          program.action()
                          setShowStartMenu(false)
                          setShowProgramsSubmenu(false)
                        }}
                      >
                        {program.icon}
                        <span className="ml-2">{program.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </li>
              <li
                className="mb-2 hover:bg-green-700 p-2 cursor-pointer"
                onClick={() => {
                  setShowStartMenu(false)
                  setShowSettings(true)
                }}
              >
                Settings
              </li>
              <li
                className="mb-2 hover:bg-green-700 p-2 cursor-pointer"
                onClick={() => {
                  setShowStartMenu(false)
                  onShutdown()
                }}
              >
                Shut Down
              </li>
            </ul>
          </div>
        )}
        {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} />}
        {showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}
        {showSystemInfo && <SystemInfoPopup onClose={() => setShowSystemInfo(false)} />}
        {showDocuments && <DocumentsModal onClose={() => setShowDocuments(false)} />}
        {showTokenHoldings && isWalletConnected && (
          <TokenHoldings
            onClose={() => setShowTokenHoldings(false)}
            walletAddress={PLACEHOLDER_WALLET}
            onDisconnect={onDisconnect}
          />
        )}
        {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
        {showNeuralScan && <NeuralScan onClose={() => setShowNeuralScan(false)} />}
        {showCodeSeer && <CodeSeer onClose={() => setShowCodeSeer(false)} />}
        {showNeoGuard && <NeoGuard onClose={() => setShowNeoGuard(false)} />}
      </div>
    </div>
  )
}

function ShutdownEffect({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

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

