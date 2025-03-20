import Image from 'next/image'

export function AgentSmith({ onComplete, onSkip }: { onComplete: () => void, onSkip: () => void }) {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-[300px] h-[300px] mx-auto mb-4 rounded-full border-4 border-green-500 overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-08zZOJj302UKh19rr0adny1ywHVRWA.png"
            alt="Agent Smith"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-green-500 font-mono text-xl mb-4">
          "Never send a human to do an agent's job."
        </p>
        <div className="flex flex-col items-center space-y-2">
          <button 
            onClick={onComplete}
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition-colors"
          >
            Enter SmithOS
          </button>
          <button
            onClick={onSkip}
            className="text-green-500 hover:text-green-400 transition-colors text-sm"
          >
            Skip Effect
          </button>
        </div>
        <div className="mt-8 text-gray-500 text-xs max-w-md mx-auto">
          <p className="mb-2">
            Agent Smith is a product of, and its tokens and operations are issued and managed by, Athena AI Labs LLC, a Texas Limited Liability Company.
          </p>
          <p>
            Disclaimer: By accessing this site, app, or any products provided by Agent Smith, you acknowledge that no content or information presented constitutes investment advice, financial recommendations, or guidance related to any form of investment.
          </p>
        </div>
      </div>
    </div>
  )
}

