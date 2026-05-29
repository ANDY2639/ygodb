import { ref } from "vue";
import config from "@/config";

const CACHE = new Map();
const CACHE_TTL = 60_000;

export default function useFetch(options = {}) {
  const result = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const abortController = ref(null);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  function buildCacheKey(file, qs) {
    const sortedQs = Object.keys(qs).sort().reduce((acc, key) => {
      acc[key] = qs[key];
      return acc;
    }, {});
    return `${file}?${JSON.stringify(sortedQs)}`;
  }

  function getCached(key) {
    const entry = CACHE.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      CACHE.delete(key);
      return null;
    }
    console.log(`[useFetch] Cache HIT: ${key}`);
    return entry.data;
  }

  function setCache(key, data) {
    CACHE.set(key, { data, timestamp: Date.now() });
    console.log(`[useFetch] Cache SET: ${key}`);
  }

  const fetchData = async (file, qs = {}) => {
    const cacheKey = buildCacheKey(file, qs);
    const cached = getCached(cacheKey);
    if (cached) {
      result.value = cached;
      error.value = null;
      loading.value = false;
      return;
    }

    if (abortController.value) {
      console.log(`[useFetch] Aborting previous request`);
      abortController.value.abort();
    }

    abortController.value = new AbortController();
    const { signal } = abortController.value;

    loading.value = true;
    error.value = null;

    const startTime = performance.now();
    console.log(`[useFetch] Request START: ${file} (${JSON.stringify(qs)})`);

    try {
      let q = (Object.keys(qs).length > 0) ? `?${new URLSearchParams(qs).toString()}` : '';
      let url = `${config.apiUrl}${file}${q}`;

      const timeoutId = setTimeout(() => {
        abortController.value?.abort();
      }, 15_000);

      const res = await fetch(url, {
        signal,
        headers: { ...defaultHeaders, ...(options.headers || {}) },
      });

      clearTimeout(timeoutId);

      const elapsed = Math.round(performance.now() - startTime);
      console.log(`[useFetch] Response ${res.status} in ${elapsed}ms: ${url}`);

      if (!res.ok) {
        const msg = `HTTP ${res.status}: ${res.statusText}`;
        console.error(`[useFetch] ${msg}`);
        error.value = msg;
        result.value = null;
        loading.value = false;
        return;
      }

      const response = await res.json();
      const data = ('data' in response) ? response.data : response;
      const totalCount = 'total' in response ? response.total : (Array.isArray(data) ? data.length : 0);
      
      console.log(`[useFetch] Response analysis:`, {
        hasTotal: 'total' in response,
        totalValue: response.total,
        countValue: response.count,
        dataLength: Array.isArray(data) ? data.length : 'N/A',
        finalTotalCount: totalCount
      });

      console.log(`[useFetch] Success: ${Array.isArray(data) ? data.length : 'object'} items, total: ${totalCount} in ${elapsed}ms`);
      console.log(`[useFetch] Response keys:`, Object.keys(response));
      console.log(`[useFetch] totalCount source:`, 'count' in response ? 'response.count' : 'total' in response ? 'response.total' : 'data.length');
      setCache(cacheKey, { data, totalCount, raw: response });
      result.value = { data, totalCount, raw: response };
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      if (err.name === 'AbortError') {
        console.log(`[useFetch] Request cancelled after ${elapsed}ms`);
        return;
      }
      console.error(`[useFetch] Error after ${elapsed}ms: ${err.message}`);
      error.value = err.message;
      result.value = null;
    }

    loading.value = false;
  };

  return { result, error, loading, abort: () => abortController.value?.abort(), fetchData };
}
