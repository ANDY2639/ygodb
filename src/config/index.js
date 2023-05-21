const config = {
  apiUrl: import.meta.env.VITE_API_URL || '',
  baseUrl: import.meta.env.VITE_BASE_URL || '',
  cardInfo: import.meta.env.VITE_CARD_INFO || '',
  archetypes: import.meta.env.VITE_ARCHETYPES || '',
  cardsets: import.meta.env.VITE_CARDSETS || '',
  cardsetsInfo: import.meta.env.VITE_CARDSETSINFO || '',
  checkDBVer: import.meta.env.VITE_CHECK_DB_VER || '',
  randomCard: import.meta.env.VITE_RANDOMCARD || '',
}

export default config;