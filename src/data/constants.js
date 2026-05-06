export const STATUSES = [
  { value: 'live',        label: 'En vivo',      color: '#10b981' },
  { value: 'demo',        label: 'Demo',          color: '#f59e0b' },
  { value: 'development', label: 'En desarrollo', color: '#6366f1' },
]

export const STATUS_LABEL = Object.fromEntries(STATUSES.map(s => [s.value, s.label]))
export const STATUS_COLOR = Object.fromEntries(STATUSES.map(s => [s.value, s.color]))
