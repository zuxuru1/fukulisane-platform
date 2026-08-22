// Business engine types and helpers
export interface EngineConfig {
  name: string
  enabled: boolean
  config: Record<string, unknown>
}

export function createEngine(config: EngineConfig) {
  return { ...config, status: 'active' as const }
}