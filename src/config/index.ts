export const config = {
  endpoints: {
    cards: `/api/v1/cards`,
    cardById: (id: string | number) => `/api/v1/cards/${id}`,
    cardByName: (name: string) => `/api/v1/cards/name/${encodeURIComponent(name)}`,
    randomCard: `/api/v1/cards/random`,
    archetypes: `/api/v1/archetypes`,
    sets: `/api/v1/sets`,
    setByCode: (code: string) => `/api/v1/sets/${code}`,
    health: `/api/v1/health`,
    version: `/api/v1/health/version`,
  },
} as const;

export default config;
