<template>
  <div class="space-y-4">
    <div class="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-3">
      <form role="search" class="flex gap-2" @submit.prevent="executeSearch">
        <label class="input input-bordered flex-1 flex items-center gap-2 bg-scanner-card border-scanner font-mono text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="search-input"
            type="text"
            class="grow bg-transparent placeholder:text-scanner-dim/40"
            placeholder="SEARCH DATABASE..."
            v-model="searchInput"
            :disabled="loading"
            aria-label="Search cards by name"
          />
        </label>
        <button 
          type="submit"
          class="btn btn-sm btn-square bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 active:scale-95 transition-transform" 
          :disabled="loading"
          aria-label="Search"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs text-cyan-500"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button 
          type="button" 
          class="btn btn-sm btn-square bg-scanner-card border border-scanner text-scanner-dim hover:border-cyan-500/30 hover:text-cyan-500 active:scale-95 transition-transform"
          :class="{ 'border-cyan-500/50 text-cyan-500': activeSwitch }"
          @click.stop="toggleFilters()" 
          :aria-label="activeSwitch ? 'Close filters' : 'Open filters'"
          :aria-expanded="activeSwitch"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </form>
    </div>

    <Transition name="filter-panel">
      <div v-if="activeSwitch" class="bg-scanner-panel border border-scanner rounded-lg p-4 mt-3">
        <form class="space-y-4" @submit.prevent="executeAdvancedSearch">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-archetype" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Archetypes</label>
            <select id="filter-archetype" class="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner" v-model="advance.archetype" :disabled="disabledInputNotMonster">
              <option value="">ALL</option>
              <option v-for="(archetype, a) in archetypes" :key="a" :value="archetype">{{ archetype }}</option>
            </select>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Race Card</label>
            <div class="flex-1 flex gap-3">
              <select id="filter-race-card" class="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner" v-model="racecard">
                <option :value="null">ALL</option>
                <option v-for="(race, i) in races" :key="i" :value="race.toLowerCase()">{{ race }}</option>
              </select>
              <select id="filter-race-option" class="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner" v-model="advance.race" :disabled="!racecard">
                <option value="">ALL</option>
                <option v-for="(option, j) in raceOptionsValue" :key="j" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-attribute" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Attribute</label>
            <select id="filter-attribute" class="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner" v-model="advance.attribute" :disabled="disabledInputNotMonster">
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

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-type" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Type</label>
            <select id="filter-type" class="select select-bordered flex-1 bg-scanner-card border-scanner text-scanner" v-model="advance.type" :disabled="disabledInputNotMonster">
              <option value="">ALL</option>
              <option v-for="(type, t) in types" :key="t" :value="type">{{ type }}</option>
            </select>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-atk-op" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">ATK</label>
            <div class="flex-1 flex gap-3">
              <select id="filter-atk-op" class="select select-bordered w-24 bg-scanner-card border-scanner text-scanner" v-model="operator.signe_atk" :disabled="disabledInputNotMonster">
                <option value="=">=</option>
                <option value="lt">&lt;</option>
                <option value="lte">&lt;=</option>
                <option value="gt">&gt;</option>
                <option value="gte">&gt;=</option>
              </select>
              <input id="filter-atk-val" type="number" class="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner" min="0" max="5000" v-model="operator.atk" :disabled="disabledInputNotMonster" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-def-op" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">DEF</label>
            <div class="flex-1 flex gap-3">
              <select id="filter-def-op" class="select select-bordered w-24 bg-scanner-card border-scanner text-scanner" v-model="operator.signe_def" :disabled="disabledInputNotMonster">
                <option value="=">=</option>
                <option value="lt">&lt;</option>
                <option value="lte">&lt;=</option>
                <option value="gt">&gt;</option>
                <option value="gte">&gt;=</option>
              </select>
              <input id="filter-def-val" type="number" class="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner" min="0" max="5000" v-model="operator.def" :disabled="disabledInputNotMonster" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-level-op" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Level/Rank</label>
            <div class="flex-1 flex gap-3">
              <select id="filter-level-op" class="select select-bordered w-24 bg-scanner-card border-scanner text-scanner" v-model="operator.signe_level" :disabled="disabledInputNotMonster">
                <option value="=">=</option>
                <option value="lt">&lt;</option>
                <option value="lte">&lt;=</option>
                <option value="gt">&gt;</option>
                <option value="gte">&gt;=</option>
              </select>
              <input id="filter-level-val" type="number" class="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner" min="0" max="13" v-model="operator.level" :disabled="disabledInputNotMonster" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-scale-op" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Pendulum Scale</label>
            <div class="flex-1 flex gap-3">
              <select id="filter-scale-op" class="select select-bordered w-24 bg-scanner-card border-scanner text-scanner" v-model="operator.signe_scale" :disabled="disabledInputNotMonster">
                <option value="=">=</option>
                <option value="lt">&lt;</option>
                <option value="lte">&lt;=</option>
                <option value="gt">&gt;</option>
                <option value="gte">&gt;=</option>
              </select>
              <input id="filter-scale-val" type="number" class="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner" min="0" max="13" v-model="operator.scale" :disabled="disabledInputNotMonster" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label for="filter-link-op" class="sm:w-48 text-sm font-medium text-scanner-dim shrink-0">Link</label>
            <div class="flex-1 flex gap-3">
              <select id="filter-link-op" class="select select-bordered w-24 bg-scanner-card border-scanner text-scanner" v-model="operator.signe_link" :disabled="disabledInputNotMonster">
                <option value="=">=</option>
                <option value="lt">&lt;</option>
                <option value="lte">&lt;=</option>
                <option value="gt">&gt;</option>
                <option value="gte">&gt;=</option>
              </select>
              <input id="filter-link-val" type="number" class="input input-bordered flex-1 bg-scanner-card border-scanner text-scanner" min="0" max="6" v-model="operator.link" :disabled="disabledInputNotMonster" />
            </div>
          </div>

          <button type="submit" class="btn btn-block bg-primary text-primary-content hover:bg-primary/90 font-medium" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Find matches
          </button>
        </form>
      </div>
    </Transition>
  </div>

  <div class="flex items-center gap-2 py-2">
    <div class="flex-1 h-px bg-scanner"></div>
    <div class="flex items-center gap-1">
      <div class="w-1 h-1 rounded-full bg-cyan-500/40"></div>
      <span class="text-[8px] font-mono text-scanner-dim/40 tracking-widest">RESULTS</span>
      <div class="w-1 h-1 rounded-full bg-cyan-500/40"></div>
    </div>
    <div class="flex-1 h-px bg-scanner"></div>
  </div>

  <div :aria-busy="loading && searched">
    <div v-if="loading && searched && !cards.length" class="scanner-loading-status">
      <div class="scanner-loader">
        <div class="scanner-loader-ring"></div>
        <div class="scanner-loader-ring"></div>
        <div class="scanner-loader-ring"></div>
        <div class="scanner-loader-core"></div>
      </div>
      <span class="scanner-loading-label">SCANNING DATABASE</span>
    </div>

    <div v-if="searched && cards.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <template v-for="(card, i) in cards" :key="card.id || i">
        <Card :card="card" />
      </template>
    </div>

    <div v-if="!loading && searched && cards.length === 0" role="alert" class="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
      <div class="flex flex-col items-center gap-3">
        <div class="flex gap-1">
          <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
          <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
          <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
          <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
        </div>
        <span class="text-sm font-mono text-scanner-dim/60">NO ENTRIES FOUND</span>
        <span class="text-xs font-mono text-scanner-dim/40">Adjust search parameters and retry</span>
        <button class="btn btn-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 font-mono text-xs" @click="clearSearch">RESET QUERY</button>
      </div>
    </div>
  </div>

  <div ref="scrollTrigger" class="h-8 flex items-center justify-center">
    <div v-if="loading && hasMore" class="scanner-loading-more">
      <div class="scanner-data-stream">
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
        <div class="scanner-data-bar"></div>
      </div>
      <span class="scanner-loading-text">LOADING MORE...</span>
    </div>
  </div>

  <div v-if="!hasMore && cards.length > 0" class="flex flex-col items-center gap-2 py-4">
    <div class="flex items-center gap-2">
      <div class="w-1 h-1 rounded-full bg-cyan-500/40"></div>
      <span class="text-xs font-mono text-scanner-dim/40">END OF RESULTS</span>
      <div class="w-1 h-1 rounded-full bg-cyan-500/40"></div>
    </div>
    <span class="text-[10px] font-mono text-scanner-dim/30">{{ cards.length }} OF {{ totalResults }} RECORDS LOADED</span>
  </div>

  <div v-if="error" role="alert" class="scanner-card-frame rounded-lg bg-scanner-panel border border-red-500/30 p-4">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-red-500 pulse-dot"></div>
      <span class="text-sm font-mono text-red-500">SYSTEM ERROR</span>
    </div>
    <p class="text-xs font-mono text-scanner-dim/60 mt-2">{{ error }}</p>
    <button class="btn btn-sm mt-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 font-mono text-xs" @click="retrySearch">RETRY CONNECTION</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import useArchetypes from "@/composables/useArchetypes";
import useCards from "@/composables/useCards";
import useUrlFilters from "@/composables/useUrlFilters";
import { debounce } from "@/composables/useDebounce";
import Card from "@/components/Card.vue";
import CardSkeleton from "@/components/CardSkeleton.vue";

const route = useRoute();

const {
  search,
  activeSwitch,
  racecard,
  advance,
  operator,
  syncToUrl,
  resetFilters,
  buildSearchParams,
} = useUrlFilters();

const { cards, error, loading, totalResults, hasMore, getCards, loadMore, resetState } = useCards();
const { archetypes, getArchetypes } = useArchetypes();

const searched = ref(false);
const searchInput = ref('');
const scrollTrigger = ref(null);
let observer = null;
let searchTimeout = null;

const races = ['Monster', 'Spell', 'Trap'];

const raceOptions = {
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
  'Effect Monster',
  'Flip Effect Monster',
  'Flip Tuner Effect Monster',
  'Gemini Monster',
  'Normal Monster',
  'Normal Tuner Monster',
  'Pendulum Effect Monster',
  'Pendulum Effect Ritual Monster',
  'Pendulum Flip Effect Monster',
  'Pendulum Normal Monster',
  'Pendulum Tuner Effect Monster',
  'Ritual Effect Monster',
  'Ritual Monster',
  'Spirit Monster',
  'Toon Monster',
  'Tuner Monster',
  'Union Effect Monster',
  'Fusion Monster',
  'Link Monster',
  'Pendulum Effect Fusion Monster',
  'Synchro Monster',
  'Synchro Pendulum Effect Monster',
  'Synchro Tuner Monster',
  'XYZ Monster',
  'XYZ Pendulum Effect Monster',
];

function debouncedExecuteSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    search.value = searchInput.value;
    executeSearch();
  }, 500);
}

watch(() => searchInput.value, () => {
  debouncedExecuteSearch();
});

watch(() => route.query, (newQuery, oldQuery) => {
  const queryChanged = newQuery.q !== oldQuery?.q || 
      newQuery.archetype !== oldQuery?.archetype ||
      newQuery.race !== oldQuery?.race ||
      newQuery.attribute !== oldQuery?.attribute ||
      newQuery.type !== oldQuery?.type;
  
  if (queryChanged) {
    searchInput.value = newQuery.q || '';
    resetState();
    searched.value = true;
    const params = buildSearchParams(0);
    getCards(params);
  }
}, { immediate: true });

const disabledInputNotMonster = computed(() => ['spell', 'trap'].includes(racecard.value));
const raceOptionsValue = computed(() => (racecard.value) ? raceOptions[racecard.value] : []);

function executeSearch() {
  clearTimeout(searchTimeout);
  search.value = searchInput.value;
  resetState();
  searched.value = true;
  syncToUrl();
  const params = buildSearchParams(0);
  getCards(params);
}

function executeAdvancedSearch() {
  resetState();
  searched.value = true;
  activeSwitch.value = false;
  syncToUrl();
  const params = buildSearchParams(0);
  getCards(params);
}

function toggleFilters() {
  activeSwitch.value = !activeSwitch.value;
}

function clearSearch() {
  searchInput.value = '';
  search.value = '';
  resetFilters();
  resetState();
  syncToUrl();
  searched.value = false;
}

function retrySearch() {
  const params = buildSearchParams(0);
  if (Object.keys(params).length > 0) {
    getCards(params);
  }
}

onMounted(() => {
  getArchetypes();
  
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        console.log('[Cards] IntersectionObserver triggered loadMore');
        loadMore(buildSearchParams);
      }
    },
    { rootMargin: '200px' }
  );

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  clearTimeout(searchTimeout);
});
</script>
