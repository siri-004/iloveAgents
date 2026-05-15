export const MODEL_MAP = {
  openai: 'gpt-4o',
  anthropic: 'claude-opus-4-20250514',
  gemini: 'gemini-2.5-flash',
};

export function resolveAgentModel(agent, actualProvider, selectedModel) {
  if (selectedModel) return selectedModel;

  if (agent.models && agent.models[actualProvider]) {
    return agent.models[actualProvider];
  }

  if (agent.model && (actualProvider === agent.defaultProvider || actualProvider === agent.provider)) {
    return agent.model;
  }

  return MODEL_MAP[actualProvider] || MODEL_MAP.openai;
}
