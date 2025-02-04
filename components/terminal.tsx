import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'

interface TerminalProps {
  onClose: () => void
}

export function Terminal({ onClose }: TerminalProps) {
  const { terminal } = useSettingsStore()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>(['Welcome to SmithOS Terminal. Type "help" for available commands.'])
  const [isChatActive, setIsChatActive] = useState(false)
  const [isListenActive, setIsListenActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const terminalStyle = {
    fontFamily: terminal.fontFamily,
    fontSize: `${terminal.fontSize}px`,
  }

  const blinkStyles = `
    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    .terminal-input input {
      caret-color: transparent;  /* Hide the native cursor */
    }
    .terminal-input input::selection {
      background: rgba(255, 255, 255, 0.3);  /* Custom selection color */
    }
    .terminal-cursor {
      display: inline-block;
      width: 8px;
      height: 1em;
      background-color: currentColor;
      animation: blink ${terminal.blinkRate}ms step-end infinite;
      vertical-align: middle;
      margin-left: 1px;
    }
  `

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processCommand(input)
    setInput('')
  }

  const processCommand = (cmd: string) => {
    if (isChatActive) {
      if (cmd.toLowerCase() === '/stop') {
        setIsChatActive(false)
        setOutput(prev => [...prev, '> /stop', 'Chat session ended.'])
      } else {
        // Placeholder chat response
        setOutput(prev => [...prev, `> ${cmd}`, `Agent Smith: I'm afraid I can't do that, Dave.`])
      }
      return
    }

    if (isListenActive) {
      if (cmd.toLowerCase() === '/stop') {
        setIsListenActive(false)
        setOutput(prev => [...prev, '> /stop', 'Stopped listening to Agent Smith actions.'])
      } else {
        setOutput(prev => [...prev, `> ${cmd}`, 'Command ignored. Type /stop to exit listen mode.'])
      }
      return
    }

    setOutput(prev => [...prev, `> ${cmd}`])
    const command = cmd.toLowerCase().trim()

    switch (command) {
      case 'help':
        setOutput(prev => [...prev, 
          'Available commands:',
          'help    - Display this help message',
          'clear   - Clear the terminal screen',
          'echo    - Display a line of text',
          'date    - Display the current date and time',
          'chat    - Initiate a conversation with Agent Smith',
          'listen  - Listen to real-time Agent Smith actions',
          'exit    - Close the terminal',
          '',
          'In chat or listen mode, type /stop to exit the mode.'
        ])
        break
      case 'clear':
        setOutput([])
        break
      case 'date':
        setOutput(prev => [...prev, new Date().toString()])
        break
      case 'chat':
        setIsChatActive(true)
        setOutput(prev => [...prev, 'Initiating chat with Agent Smith. Type /stop to end the conversation.'])
        break
      case 'listen':
        setIsListenActive(true)
        setOutput(prev => [...prev, 'Listening to Agent Smith actions. Type /stop to stop listening.'])
        break
      case 'exit':
        onClose()
        break
      default:
        if (command.startsWith('echo ')) {
          setOutput(prev => [...prev, command.slice(5)])
        } else {
          setOutput(prev => [...prev, `Command not found: ${command}`])
        }
    }
  }

  const getPrompt = () => {
    if (isChatActive) return terminal.promptStyle + 'chat> '
    if (isListenActive) return terminal.promptStyle + 'listen> '
    return terminal.promptStyle
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <style>{blinkStyles}</style>
      <div className="bg-black border border-green-500 w-full max-w-2xl h-96 flex flex-col rounded-lg overflow-hidden">
        <div className="bg-green-900 p-2 flex justify-between items-center">
          <span className="text-green-100 font-bold">SmithOS Terminal</span>
          <button onClick={onClose} className="text-green-100 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div ref={outputRef} className="flex-1 p-4 overflow-y-auto text-green-500" style={terminalStyle}>
          {output.map((line, index) => (
            <div key={index}>
              {line.startsWith('>') ? getPrompt() + line.slice(2) : line}
            </div>
          ))}
        </div>
        <form onSubmit={handleInputSubmit} className="p-2 border-t border-green-500">
          <div className="flex items-center" style={terminalStyle}>
            <span className="text-green-500 mr-2">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full bg-black text-green-500 p-2 focus:outline-none"
              style={terminalStyle}
              placeholder={isChatActive ? "Chat with Agent Smith..." : isListenActive ? "Listening..." : "Enter command..."}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

