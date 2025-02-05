import { useState, useEffect } from "react"
import { X, Pill } from "lucide-react"
import { ModalWrapper } from "@/components/modal-wrapper"

interface RedPillBluePillProps {
  onClose: () => void
}

export function RedPillBluePill({ onClose }: RedPillBluePillProps) {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const savedHighScore = localStorage.getItem("redPillBluePillHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore, 10))
    }
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("redPillBluePillHighScore", score.toString())
    }
  }, [score, highScore])

  const handlePillChoice = (choice: "red" | "blue") => {
    const correctChoice = Math.random() < 0.5 ? "red" : "blue"
    if (choice === correctChoice) {
      setScore(score + 1)
    } else {
      setGameOver(true)
    }
  }

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
  }

  return (
    <ModalWrapper onClose={onClose} className="p-6 rounded-lg w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">Red Pill Blue Pill</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>
      <div className="text-center mb-6">
        <p className="text-green-300 mb-2">Score: {score}</p>
        <p className="text-green-300">High Score: {highScore}</p>
      </div>
      {!gameOver ? (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handlePillChoice("red")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center"
          >
            <Pill className="mr-2" /> Red Pill
          </button>
          <button
            onClick={() => handlePillChoice("blue")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center"
          >
            <Pill className="mr-2" /> Blue Pill
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-500 mb-4">Game Over!</p>
          <button onClick={resetGame} className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded">
            Play Again
          </button>
        </div>
      )}
    </ModalWrapper>
  )
}

