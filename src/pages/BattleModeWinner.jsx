import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Trophy, Copy, Check, RotateCcw, ArrowLeft } from 'lucide-react'
import BattleNavbar from '../components/BattleNavbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BattleModeWinner() {
  const navigate = useNavigate()
  const location = useLocation()
  const { provider, content, duration, agentName } = location.state || {}
  const [copied, setCopied] = useState(false)

  if (!provider || !content) {
    navigate('/battle', { replace: true })
    return null
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = content
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BattleNavbar />

      <main className="pt-14 max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10 battle-fade-in">
          <div className="w-24 h-24 rounded-2xl bg-yellow-400/10 border border-yellow-400/20
            flex items-center justify-center mx-auto mb-6 battle-glow-gold">
            <Trophy size={48} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2
            bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
            Winner
          </h1>
          <p className="text-lg font-semibold mb-1" style={{ color: getProviderColor(provider.color) }}>
            {provider.label}
          </p>
          <p className="text-xs text-gray-500">
            {agentName && `Agent: ${agentName}`}
            {duration && ` \u00B7 ${(duration / 1000).toFixed(1)}s`}
          </p>
        </div>

        {/* Winning Output */}
        <div className="rounded-xl border border-yellow-400/20 bg-gray-900/50 p-5 mb-8 battle-fade-in"
          style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Winning Output
            </span>
          </div>
          <div className="markdown-output text-sm text-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 battle-fade-in"
          style={{ animationDelay: '350ms' }}>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 transition-all"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Winner Output'}
          </button>

          <button
            onClick={() => navigate('/battle/setup')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 transition-all"
          >
            <RotateCcw size={16} />
            Run Battle Again
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Agents
          </button>
        </div>
      </main>
    </div>
  )
}

function getProviderColor(color) {
  const map = {
    yellow: '#facc15',
    violet: '#a78bfa',
    blue: '#60a5fa',
  }
  return map[color] || '#f4f4f5'
}
