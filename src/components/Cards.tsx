import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCardFilters } from '@/hooks/useCardFilters';
import { useCards, mapCard } from '@/hooks/useCards';
import { useArchetypes } from '@/hooks/useArchetypes';
import Card from '@/components/Card';

const races = ['Monster', 'Spell', 'Trap'];

const raceOptions: Record<string, string[]> = {
  monster: [
    'Aqua', 'Beast', 'Beast-Warrior', 'Creator-God', 'Cyberse',
    'Dinosaur', 'Divine-Beast', 'Dragon', 'Fairy', 'Fiend',
    'Fish', 'Insect', 'Machine', 'Plant', 'Psychic',
    'Pyro', 'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster',
    'Thunder', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie',
  ],
  spell: ['Normal', 'Field', 'Equip', 'Continuous', 'Quick-Play', 'Ritual'],
  trap: ['Normal', 'Continuous', 'Counter'],
};

const types = [
  'Effect Monster', 'Flip Effect Monster', 'Flip Tuner Effect Monster',
  'Gemini Monster', 'Normal Monster', 'Normal Tuner Monster',
  'Pendulum Effect Monster', 'Pendulum Effect Ritual Monster',
  'Pendulum Flip Effect Monster', 'Pendulum Normal Monster',
  'Pendulum Tuner Effect Monster', 'Ritual Effect Monster',
  'Ritual Monster', 'Spirit Monster', 'Toon Monster', 'Tuner Monster',
  'Union Effect Monster', 'Fusion Monster', 'Link Monster',
  'Pendulum Effect Fusion Monster', 'Synchro Monster',
  'Synchro Pendulum Effect Monster', 'Synchro Tuner Monster',
  'XYZ Monster', 'XYZ Pendulum Effect Monster',
];

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T, delay = 500
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export default function Cards() {
  const { filters, setFilters, buildQueryParams, resetFilters } = useCardFilters();
  const { data: archetypes = [] } = useArchetypes();

  const [searchInput, setSearchInput] = useState(filters.q);
  const [searched, setSearched] = useState(!!filters.q);
  const scrollTrigger = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryParams = buildQueryParams();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useCards(queryParams, searched);

  // Show toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`, {
        id: 'cards-error',
        duration: 5000,
      });
    }
  }, [error]);

  const cards = data?.pages.flatMap((page) =>
    page.data.map((r) => mapCard(r.attributes, r.id))
  ) ?? [];

  const totalResults = data?.pages[data.pages.length - 1]?.meta.totalItems ?? 0;

  const disabledInputNotMonster = ['spell', 'trap'].includes(filters.race || '');
  const raceOptionsValue = filters.race ? raceOptions[filters.race] || [] : [];

  const initialQueryRef = useRef(filters.q);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters({ q: value });
      setSearched(true);
    }, 800),
    [setFilters]
  );

  useEffect(() => {
    // Skip the very first render if there's nothing in the URL
    const isInitialMount = initialQueryRef.current === searchInput;

    if (isInitialMount && searchInput) {
      // User arrived with ?q=X in URL: trigger immediately
      setSearched(true);
      return;
    }

    // Typing or clearing
    if (searchInput) {
      debouncedSearch(searchInput);
    } else {
      setFilters({ q: null });
      setSearched(false);
    }
  }, [searchInput, debouncedSearch]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && searched) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    if (scrollTrigger.current) {
      observer.current.observe(scrollTrigger.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [hasNextPage, isFetchingNextPage, searched, fetchNextPage]);

  const executeSearch = () => {
    if (searchInput) {
      setFilters({ q: searchInput });
      setSearched(true);
    }
  };

  const executeAdvancedSearch = () => {
    setSearched(true);
    setFilters({ advanced: false });
  };

  const clearSearch = () => {
    setSearchInput('');
    resetFilters();
    setSearched(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-3">
          <form role="search" className="flex gap-2" onSubmit={(e) => { e.preventDefault(); executeSearch(); }}>
            <label className="input input-bordered flex-1 flex items-center gap-2 bg-scanner-card border-scanner font-mono text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-input"
                type="text"
                className="grow bg-transparent placeholder:text-scanner-dim/40"
                placeholder="SEARCH DATABASE..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={isFetching}
                aria-label="Search cards by name"
              />
            </label>
            <button
              type="submit"
              className="btn btn-sm btn-square bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 active:scale-95 transition-transform"
              disabled={isFetching}
              aria-label="Search"
            >
              {isFetching ? (
                <span className="loading loading-spinner loading-xs text-cyan-500"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-square bg-scanner-card border border-scanner text-scanner-dim hover:border-cyan-500/30 hover:text-cyan-500 active:scale-95 transition-transform ${filters.advanced ? 'border-cyan-500/50 text-cyan-500' : ''}`}
              onClick={() => setFilters({ advanced: !filters.advanced })}
              aria-label={filters.advanced ? 'Close filters' : 'Open filters'}
              aria-expanded={filters.advanced}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </form>
        </div>

        {filters.advanced && (
          <div className="bg-scanner-panel border border-scanner rounded-lg p-4 mt-3">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); executeAdvancedSearch(); }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-archetype" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Archetypes</label>
                <select
                  id="filter-archetype"
                  className="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                  value={filters.archetype}
                  onChange={(e) => setFilters({ archetype: e.target.value })}
                  disabled={disabledInputNotMonster}
                >
                  <option value="">ALL</option>
                  {archetypes.map((archetype, a) => (
                    <option key={a} value={archetype}>{archetype}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Race Card</label>
                <div className="flex-1 flex gap-3">
                  <select
                    id="filter-race-card"
                    className="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    value={filters.race || ''}
                    onChange={(e) => setFilters({ race: e.target.value || null })}
                  >
                    <option value="">ALL</option>
                    {races.map((race, i) => (
                      <option key={i} value={race.toLowerCase()}>{race}</option>
                    ))}
                  </select>
                  <select
                    id="filter-race-option"
                    className="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    value={filters.raceOption}
                    onChange={(e) => setFilters({ raceOption: e.target.value })}
                    disabled={!filters.race}
                  >
                    <option value="">ALL</option>
                    {raceOptionsValue.map((option, j) => (
                      <option key={j} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-attribute" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Attribute</label>
                <select
                  id="filter-attribute"
                  className="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                  value={filters.attribute}
                  onChange={(e) => setFilters({ attribute: e.target.value })}
                  disabled={disabledInputNotMonster}
                >
                  <option value="">ALL</option>
                  <option>Earth</option>
                  <option>Water</option>
                  <option>Fire</option>
                  <option>Wind</option>
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Divine</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-type" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Type</label>
                <select
                  id="filter-type"
                  className="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                  value={filters.type}
                  onChange={(e) => setFilters({ type: e.target.value })}
                  disabled={disabledInputNotMonster}
                >
                  <option value="">ALL</option>
                  {types.map((type, t) => (
                    <option key={t} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-atk-op" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">ATK</label>
                <div className="flex-1 flex gap-3">
                  <select
                    id="filter-atk-op"
                    className="select select-bordered w-24 bg-scanner-card border-scanner text-scanner"
                    value={filters.atkOp}
                    onChange={(e) => setFilters({ atkOp: e.target.value })}
                    disabled={disabledInputNotMonster}
                  >
                    <option value="=">=</option>
                    <option value="lt">&lt;</option>
                    <option value="lte">&lt;=</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">&gt;=</option>
                  </select>
                  <input
                    id="filter-atk-val"
                    type="number"
                    className="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    min="0"
                    max="5000"
                    value={filters.atk}
                    onChange={(e) => setFilters({ atk: e.target.value })}
                    disabled={disabledInputNotMonster}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-def-op" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">DEF</label>
                <div className="flex-1 flex gap-3">
                  <select
                    id="filter-def-op"
                    className="select select-bordered w-24 bg-scanner-card border-scanner text-scanner"
                    value={filters.defOp}
                    onChange={(e) => setFilters({ defOp: e.target.value })}
                    disabled={disabledInputNotMonster}
                  >
                    <option value="=">=</option>
                    <option value="lt">&lt;</option>
                    <option value="lte">&lt;=</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">&gt;=</option>
                  </select>
                  <input
                    id="filter-def-val"
                    type="number"
                    className="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    min="0"
                    max="5000"
                    value={filters.def}
                    onChange={(e) => setFilters({ def: e.target.value })}
                    disabled={disabledInputNotMonster}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-level-op" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Level/Rank</label>
                <div className="flex-1 flex gap-3">
                  <select
                    id="filter-level-op"
                    className="select select-bordered w-24 bg-scanner-card border-scanner text-scanner"
                    value={filters.lvlOp}
                    onChange={(e) => setFilters({ lvlOp: e.target.value })}
                    disabled={disabledInputNotMonster}
                  >
                    <option value="=">=</option>
                    <option value="lt">&lt;</option>
                    <option value="lte">&lt;=</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">&gt;=</option>
                  </select>
                  <input
                    id="filter-level-val"
                    type="number"
                    className="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    min="0"
                    max="13"
                    value={filters.level}
                    onChange={(e) => setFilters({ level: e.target.value })}
                    disabled={disabledInputNotMonster}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-scale-op" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Pendulum Scale</label>
                <div className="flex-1 flex gap-3">
                  <select
                    id="filter-scale-op"
                    className="select select-bordered w-24 bg-scanner-card border-scanner text-scanner"
                    value={filters.scaleOp}
                    onChange={(e) => setFilters({ scaleOp: e.target.value })}
                    disabled={disabledInputNotMonster}
                  >
                    <option value="=">=</option>
                    <option value="lt">&lt;</option>
                    <option value="lte">&lt;=</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">&gt;=</option>
                  </select>
                  <input
                    id="filter-scale-val"
                    type="number"
                    className="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    min="0"
                    max="13"
                    value={filters.scale}
                    onChange={(e) => setFilters({ scale: e.target.value })}
                    disabled={disabledInputNotMonster}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="filter-link-op" className="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Link</label>
                <div className="flex-1 flex gap-3">
                  <select
                    id="filter-link-op"
                    className="select select-bordered w-24 bg-scanner-card border-scanner text-scanner"
                    value={filters.linkOp}
                    onChange={(e) => setFilters({ linkOp: e.target.value })}
                    disabled={disabledInputNotMonster}
                  >
                    <option value="=">=</option>
                    <option value="lt">&lt;</option>
                    <option value="lte">&lt;=</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">&gt;=</option>
                  </select>
                  <input
                    id="filter-link-val"
                    type="number"
                    className="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner"
                    min="0"
                    max="6"
                    value={filters.link}
                    onChange={(e) => setFilters({ link: e.target.value })}
                    disabled={disabledInputNotMonster}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-block bg-primary text-primary-content hover:bg-primary/90 font-medium"
                disabled={isFetching}
              >
                {isFetching ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Find matches'
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 py-2">
        <div className="flex-1 h-px bg-scanner"></div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-cyan-500/40"></div>
          <span className="text-[8px] font-mono text-scanner-dim/40 tracking-widest">RESULTS</span>
          <div className="w-1 h-1 rounded-full bg-cyan-500/40"></div>
        </div>
        <div className="flex-1 h-px bg-scanner"></div>
      </div>

      <div aria-busy={isFetching && searched}>
        {isFetching && searched && cards.length === 0 && (
          <div className="scanner-loading-status">
            <div className="scanner-loader">
              <div className="scanner-loader-ring"></div>
              <div className="scanner-loader-ring"></div>
              <div className="scanner-loader-ring"></div>
              <div className="scanner-loader-core"></div>
            </div>
            <span className="scanner-loading-label">SCANNING DATABASE</span>
          </div>
        )}

        {searched && cards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cards.map((card, i) => (
              <Card key={card.id || i} card={card} />
            ))}
          </div>
        )}

        {!isFetching && searched && cards.length === 0 && (
          <div role="alert" className="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
                <div className="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
                <div className="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
                <div className="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
              </div>
              <span className="text-sm font-mono text-scanner-dim/60">NO ENTRIES FOUND</span>
              <span className="text-xs font-mono text-scanner-dim/40">Adjust search parameters and retry</span>
              <button
                className="btn btn-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 font-mono text-xs"
                onClick={clearSearch}
              >
                RESET QUERY
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={scrollTrigger} className="h-8 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="scanner-loading-more">
            <div className="scanner-data-stream">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="scanner-data-bar"></div>
              ))}
            </div>
            <span className="scanner-loading-text">LOADING MORE...</span>
          </div>
        )}
      </div>

      {!hasNextPage && cards.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-cyan-500/40"></div>
            <span className="text-xs font-mono text-scanner-dim/40">END OF RESULTS</span>
            <div className="w-1 h-1 rounded-full bg-cyan-500/40"></div>
          </div>
          <span className="text-[10px] font-mono text-scanner-dim/30">
            {cards.length} OF {totalResults} RECORDS LOADED
          </span>
        </div>
      )}
    </>
  );
}
