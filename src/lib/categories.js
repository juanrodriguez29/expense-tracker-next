export const CATEGORIES = [
  { id: 'food',          label: 'Food',          color: '#22C55E', 
    glyph: '<path d="M5 3v7M8 3v7M6.5 10v9M16 3c-1.5 1-2 3-2 6s.5 4 2 5v5"/>'},
  { id: 'transport',     label: 'Transport',      color: '#3B82F6', 
    glyph: '<rect x="4" y="7" width="16" height="9" rx="2"/><path d="M7 16v2M17 16v2M4 11h16"/>'  },
  { id: 'bills',         label: 'Bills',          color: '#F59E0B',
    glyph: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/>'},
  { id: 'shopping',      label: 'Shopping',       color: '#A855F7', 
    glyph: '<path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0"/>'},
  { id: 'entertainment', label: 'Entertainment',  color: '#EC4899', 
    glyph: '<circle cx="12" cy="12" r="8"/><path d="M10 9l5 3-5 3V9z"/>'},
  { id: 'health',        label: 'Health',         color: '#EF4444',
    glyph: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/>'},
  { id: 'savings',       label: 'Savings',        color: '#1FAEEC',
    glyph: '<path d="M4 9a8 5 0 0 1 16 0v4a8 5 0 0 1-16 0V9zM16 11h.01"/>'},
  { id: 'other',         label: 'Other',          color: '#94A3B8', 
    glyph: '<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>'},
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map(cat => [cat.id, cat.label])
)

console.log(CATEGORY_MAP)