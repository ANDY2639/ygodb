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

  const activeCount = [
    filters.archetype,
    filters.race,
    filters.raceOption,
    filters.attribute,
    filters.type,
    filters.atk,
    filters.def,
    filters.level,
    filters.scale,
    filters.link,
  ].filter(Boolean).length;

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
            <label className="input input-bordered flex-1 flex items-center gap-2 bg-scanner-card border-scanner font-mono text-sm outline-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-scanner-glow/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              className="btn btn-sm btn-square h-10 w-10 bg-scanner-glow/10 border border-scanner-glow/30 text-scanner-glow hover:bg-scanner-glow/20 hover:border-scanner-glow/50 active:scale-95 transition-transform"
              disabled={isFetching}
              aria-label="Search"
            >
              {isFetching ? (
                <span className="loading loading-spinner loading-xs text-scanner-glow"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={`relative btn btn-sm btn-square h-10 w-10 bg-scanner-card border text-scanner-dim hover:border-scanner-glow/30 hover:text-scanner-glow active:scale-95 transition-transform ${filters.advanced || activeCount > 0 ? 'border-scanner-glow/50 text-scanner-glow' : 'border-scanner'}`}
              onClick={() => setFilters({ advanced: !filters.advanced })}
              aria-label={filters.advanced ? 'Close filters' : 'Open filters'}
              aria-expanded={filters.advanced}
            >
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-scanner-glow text-[9px] font-bold flex items-center justify-center text-scanner-deep leading-none z-10 shadow-xs shadow-scanner-glow/30">
                  {activeCount}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </form>
        </div>

        {filters.advanced && (
          <div className="bg-scanner-panel border border-scanner rounded-lg p-4 mt-3 transition-all duration-300">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); executeAdvancedSearch(); }}>

              {/* SECTION: CARD TYPE */}
              <div>
                <h4 className="text-[10px] font-mono text-scanner-label tracking-widest mb-3 flex items-center gap-2 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-scanner-glow/50"></span>
                  Card Type
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Archetype */}
                  <div className="form-control">
                    <label htmlFor="filter-archetype" className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">ARCHETYPE</span>
                    </label>
                    <select
                      id="filter-archetype"
                      className={`select select-bordered bg-scanner-card text-scanner-text font-mono text-xs w-full ${filters.archetype ? 'border-scanner-glow/40' : 'border-scanner'}`}
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

                  {/* Race Card */}
                  <div className="form-control">
                    <label className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">RACE CARD</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="filter-race-card"
                        className={`select select-bordered flex-1 bg-scanner-card text-scanner-text font-mono text-xs w-full ${filters.race ? 'border-scanner-glow/40' : 'border-scanner'}`}
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
                        className={`select select-bordered flex-1 bg-scanner-card text-scanner-text font-mono text-xs w-full ${filters.raceOption ? 'border-scanner-glow/40' : 'border-scanner'}`}
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

                  {/* Attribute */}
                  <div className="form-control">
                    <label htmlFor="filter-attribute" className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">ATTRIBUTE</span>
                    </label>
                    <select
                      id="filter-attribute"
                      className={`select select-bordered bg-scanner-card text-scanner-text font-mono text-xs w-full ${filters.attribute ? 'border-scanner-glow/40' : 'border-scanner'}`}
                      value={filters.attribute}
                      onChange={(e) => setFilters({ attribute: e.target.value })}
                      disabled={disabledInputNotMonster}
                    >
                      <option value="">ALL</option>
                      <option>EARTH</option>
                      <option>WATER</option>
                      <option>FIRE</option>
                      <option>WIND</option>
                      <option>LIGHT</option>
                      <option>DARK</option>
                      <option>DIVINE</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div className="form-control">
                    <label htmlFor="filter-type" className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">TYPE</span>
                    </label>
                    <select
                      id="filter-type"
                      className={`select select-bordered bg-scanner-card text-scanner-text font-mono text-xs w-full ${filters.type ? 'border-scanner-glow/40' : 'border-scanner'}`}
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
                </div>
              </div>

              {/* SECTION: STATS */}
              <div>
                <h4 className="text-[10px] font-mono text-scanner-label tracking-widest mb-3 flex items-center gap-2 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-scanner-glow/50"></span>
                  Stats
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* ATK */}
                  <div className="form-control">
                    <label className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">ATK</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="filter-atk-op"
                        className="select select-bordered w-20 bg-scanner-card border-scanner text-scanner-text font-mono text-xs"
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
                        className={`input input-bordered flex-1 bg-scanner-card font-mono text-xs text-scanner-text ${filters.atk ? 'border-scanner-glow/40' : 'border-scanner'}`}
                        min="0"
                        max="5000"
                        value={filters.atk}
                        onChange={(e) => setFilters({ atk: e.target.value })}
                        disabled={disabledInputNotMonster}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* DEF */}
                  <div className="form-control">
                    <label className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">DEF</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="filter-def-op"
                        className="select select-bordered w-20 bg-scanner-card border-scanner text-scanner-text font-mono text-xs"
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
                        className={`input input-bordered flex-1 bg-scanner-card font-mono text-xs text-scanner-text ${filters.def ? 'border-scanner-glow/40' : 'border-scanner'}`}
                        min="0"
                        max="5000"
                        value={filters.def}
                        onChange={(e) => setFilters({ def: e.target.value })}
                        disabled={disabledInputNotMonster}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Level/Rank */}
                  <div className="form-control">
                    <label className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">LEVEL / RANK</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="filter-level-op"
                        className="select select-bordered w-20 bg-scanner-card border-scanner text-scanner-text font-mono text-xs"
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
                        className={`input input-bordered flex-1 bg-scanner-card font-mono text-xs text-scanner-text ${filters.level ? 'border-scanner-glow/40' : 'border-scanner'}`}
                        min="0"
                        max="13"
                        value={filters.level}
                        onChange={(e) => setFilters({ level: e.target.value })}
                        disabled={disabledInputNotMonster}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Pendulum Scale */}
                  <div className="form-control">
                    <label className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">PENDULUM SCALE</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="filter-scale-op"
                        className="select select-bordered w-20 bg-scanner-card border-scanner text-scanner-text font-mono text-xs"
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
                        className={`input input-bordered flex-1 bg-scanner-card font-mono text-xs text-scanner-text ${filters.scale ? 'border-scanner-glow/40' : 'border-scanner'}`}
                        min="0"
                        max="13"
                        value={filters.scale}
                        onChange={(e) => setFilters({ scale: e.target.value })}
                        disabled={disabledInputNotMonster}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Link */}
                  <div className="form-control">
                    <label className="label py-0.5 min-h-0">
                      <span className="label-text font-mono text-[10px] text-scanner-label tracking-wider">LINK</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="filter-link-op"
                        className="select select-bordered w-20 bg-scanner-card border-scanner text-scanner-text font-mono text-xs"
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
                        className={`input input-bordered flex-1 bg-scanner-card font-mono text-xs text-scanner-text ${filters.link ? 'border-scanner-glow/40' : 'border-scanner'}`}
                        min="0"
                        max="6"
                        value={filters.link}
                        onChange={(e) => setFilters({ link: e.target.value })}
                        disabled={disabledInputNotMonster}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Disabled hint */}
              {disabledInputNotMonster && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-scanner-muted/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Monster-only fields disabled for Spell/Trap cards</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn flex-1 bg-scanner-glow/10 border border-scanner-glow/30 text-scanner-glow hover:bg-scanner-glow/20 font-mono text-xs tracking-wider h-9 min-h-0"
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    'FIND MATCHES'
                  )}
                </button>
                <button
                  type="button"
                  className="btn bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 font-mono text-xs tracking-wider h-9 min-h-0 px-4 transition-all"
                  onClick={clearSearch}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  CLEAR
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 py-2">
        <div className="flex-1 h-px bg-scanner"></div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-scanner-glow/40"></div>
          <span className="text-[8px] font-mono text-scanner-dim/40 tracking-widest">RESULTS</span>
          <div className="w-1 h-1 rounded-full bg-scanner-glow/40"></div>
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
                <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
                <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
                <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
                <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
              </div>
              <span className="text-sm font-mono text-scanner-dim/60">NO ENTRIES FOUND</span>
              <span className="text-xs font-mono text-scanner-dim/40">Adjust search parameters and retry</span>
              <button
                className="btn btn-sm bg-scanner-glow/10 border border-scanner-glow/30 text-scanner-glow hover:bg-scanner-glow/20 font-mono text-xs"
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
            <div className="w-1 h-1 rounded-full bg-scanner-glow/40"></div>
            <span className="text-xs font-mono text-scanner-dim/40">END OF RESULTS</span>
            <div className="w-1 h-1 rounded-full bg-scanner-glow/40"></div>
          </div>
          <span className="text-[10px] font-mono text-scanner-dim/30">
            {cards.length} OF {totalResults} RECORDS LOADED
          </span>
        </div>
      )}
    </>
  );
}
