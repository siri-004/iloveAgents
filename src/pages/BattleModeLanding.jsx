import { useNavigate } from 'react-router-dom'
import { Swords, ArrowLeft, Crosshair, PenLine, Cpu, Trophy } from 'lucide-react'
import BattleNavbar from '../components/BattleNavbar'

const steps = [
  { icon: Crosshair, text: 'Pick any agent' },
  { icon: PenLine,    text: 'Enter your input once' },
  { icon: Cpu,        text: 'GPT-4o vs Claude Sonnet vs Gemini Flash generate outputs' },
  { icon: Trophy,     text: 'You pick the winner' },
]

export default function BattleModeLanding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BattleNavbar />

      <main className="pt-14 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-20 left-4 sm:left-6 flex items-center gap-1.5 text-xs font-medium
            text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Agents
        </button>

        {/* Hero */}
        <div className="text-center mb-12 battle-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-yellow-400/10 border border-yellow-400/20
            flex items-center justify-center mx-auto mb-6 battle-glow-gold">
            <Swords size={40} className="text-yellow-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3
            bg-gradient-to-r from-yellow-300 via-white to-violet-400 bg-clip-text text-transparent
            drop-shadow-[0_0_30px_rgba(250,204,21,0.3)]">
            Battle Mode
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Pit three AI providers against each other. Same prompt, three outputs, you decide who wins.
          </p>
        </div>

        {/* Steps */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-800
                  bg-gray-900/50 backdrop-blur-sm battle-step-in"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-gray-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Step {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-200">{step.text}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate('/battle/setup')}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold
            bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-950
            hover:from-yellow-400 hover:to-amber-400 transition-all duration-200
            shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40
            active:scale-[0.97] battle-fade-in"
          style={{ animationDelay: '700ms' }}
        >
          <Swords size={18} />
          Start Battle
        </button>
      </main>
    </div>
  )
}
