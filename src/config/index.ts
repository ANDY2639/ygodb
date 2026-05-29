import.meta.env;

const API_BASE = import.meta.env.VITE_API_URL;

export const config = {
  endpoints: {
    cards: `${API_BASE}/api/v1/cards`,
    cardById: (id: string | number) => `${API_BASE}/api/v1/cards/${id}`,
    cardByName: (name: string) => `${API_BASE}/api/v1/cards/name/${encodeURIComponent(name)}`,
    randomCard: `${API_BASE}/api/v1/cards/random`,
    archetypes: `${API_BASE}/api/v1/archetypes`,
    sets: `${API_BASE}/api/v1/sets`,
    setByCode: (code: string) => `${API_BASE}/api/v1/sets/${code}`,
    health: `${API_BASE}/api/v1/health`,
    version: `${API_BASE}/api/v1/health/version`,
  },
} as const;

export default config;
