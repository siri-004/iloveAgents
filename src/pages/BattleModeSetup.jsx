import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Key, Swords, ArrowLeft } from 'lucide-react'
import agents from '../agents/registry'
import BattleNavbar from '../components/BattleNavbar'

export default function BattleModeSetup() {
  const navigate = useNavigate()
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [inputs, setInputs] = useState({})
  const [apiKeys, setApiKeys] = useState({ openai: '', anthropic: '', gemini: '' })

  const selectedAgent = useMemo(
    () => agents.find((a) => a.id === selectedAgentId),
    [selectedAgentId]
  )

  // Initialize input defaults when agent changes
  const handleAgentChange = (agentId) => {
    setSelectedAgentId(agentId)
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) { setInputs({}); return }

    const defaults = {}
    agent.inputs.forEach((input) => {
      if (input.defaultValue !== undefined) {
        defaults[input.id] = input.defaultValue
      } else if (input.type === 'multiselect') {
        defaults[input.id] = []
      } else {
        defaults[input.id] = ''
      }
    })
    setInputs(defaults)
  }

  const updateInput = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }))
  }

  const toggleMultiselect = (id, option) => {
    setInputs((prev) => {
      const current = prev[id] || []
      return {
        ...prev,
        [id]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      }
    })
  }

  const canStart = () => {
    if (!selectedAgent) return false
    if (!apiKeys.openai || !apiKeys.anthropic || !apiKeys.gemini) return false
    return selectedAgent.inputs
      .filter((i) => i.required)
      .every((i) => {
        const v = inputs[i.id]
        if (Array.isArray(v)) return v.length > 0
        return v && v.trim() !== ''
      })
  }

  const handleStart = () => {
    navigate('/battle/arena', {
      state: {
        agent: selectedAgent,
        inputs,
        apiKeys,
      },
    })
  }

  const keyFields = [
    { id: 'openai',    label: 'OpenAI API Key',    color: 'yellow',  borderColor: 'border-yellow-400/30', focusColor: 'focus:ring-yellow-400/40 focus:border-yellow-400/50' },
    { id: 'anthropic', label: 'Anthropic API Key',  color: 'violet',  borderColor: 'border-violet-400/30', focusColor: 'focus:ring-violet-400/40 focus:border-violet-400/50' },
    { id: 'gemini',    label: 'Google Gemini API Key', color: 'blue', borderColor: 'border-blue-400/30',   focusColor: 'focus:ring-blue-400/40 focus:border-blue-400/50' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BattleNavbar />

      <main className="pt-14 max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/battle')}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 battle-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
            <Settings size={20} className="text-gray-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Battle Setup</h1>
            <p className="text-xs text-gray-400">Pick an agent, enter your inputs, provide API keys</p>
          </div>
        </div>

        {/* Agent Picker */}
        <div className="mb-6 battle-fade-in" style={{ animationDelay: '100ms' }}>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Select Agent
          </label>
          <select
            value={selectedAgentId}
            onChange={(e) => handleAgentChange(e.target.value)}
            className="w-full h-10 px-3 rounded-lg text-sm bg-gray-900 border border-gray-700
              text-white cursor-pointer focus:ring-1 focus:ring-yellow-400/40 focus:border-yellow-400/50 outline-none"
          >
            <option value="">-- Choose an agent --</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.category})
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Agent Inputs */}
        {selectedAgent && (
          <div className="mb-8 space-y-4 battle-fade-in" style={{ animationDelay: '150ms' }}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Agent Inputs
            </h2>
            {selectedAgent.inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  {input.label}
                  {input.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>

                {input.type === 'text' && (
                  <input
                    type="text"
                    value={inputs[input.id] || ''}
                    onChange={(e) => updateInput(input.id, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full h-9 px-3 rounded-lg text-sm bg-gray-900 border border-gray-700
                      text-white placeholder:text-gray-500
                      focus:ring-1 focus:ring-accent/40 focus:border-accent/50 outline-none"
                  />
                )}

                {(input.type === 'textarea' || input.type === 'code') && (
                  <textarea
                    value={inputs[input.id] || ''}
                    onChange={(e) => updateInput(input.id, e.target.value)}
                    placeholder={input.placeholder}
                    rows={input.type === 'code' ? 8 : 4}
                    className={`w-full px-3 py-2 rounded-lg text-sm bg-gray-900 border border-gray-700
                      text-white placeholder:text-gray-500 resize-y
                      focus:ring-1 focus:ring-accent/40 focus:border-accent/50 outline-none
                      ${input.type === 'code' ? 'font-mono text-xs text-green-300' : ''}`}
                  />
                )}

                {input.type === 'select' && (
                  <select
                    value={inputs[input.id] || input.defaultValue || ''}
                    onChange={(e) => updateInput(input.id, e.target.value)}
                    className="h-9 px-3 rounded-lg text-sm bg-gray-900 border border-gray-700
                      text-white cursor-pointer focus:ring-1 focus:ring-accent/40 focus:border-accent/50 outline-none"
                  >
                    {input.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {input.type === 'multiselect' && (
                  <div className="flex flex-wrap gap-2">
                    {input.options?.map((opt) => {
                      const selected = (inputs[input.id] || []).includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleMultiselect(input.id, opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                            ${selected
                              ? 'bg-accent/15 text-accent border-accent/30'
                              : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
                            }`}
                        >
                          {selected && '+ '}{opt}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* API Keys */}
        <div className="mb-8 space-y-4 battle-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            API Keys
          </h2>
          {keyFields.map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={14} className={`text-${field.color}-400`} />
                </div>
                <input
                  type="password"
                  value={apiKeys[field.id]}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={`Enter your ${field.label}...`}
                  className={`w-full h-10 pl-9 pr-3 rounded-lg text-sm bg-gray-900 border ${field.borderColor}
                    text-white placeholder:text-gray-500 outline-none
                    focus:ring-1 ${field.focusColor}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Start Battle */}
        <button
          onClick={handleStart}
          disabled={!canStart()}
          className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold
            bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-950
            hover:from-yellow-400 hover:to-amber-400 transition-all duration-200
            shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40
            active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:from-yellow-500 disabled:hover:to-amber-500 disabled:hover:shadow-yellow-500/20"
        >
          <Swords size={18} />
          Start Battle
        </button>
      </main>
    </div>
  )
}
