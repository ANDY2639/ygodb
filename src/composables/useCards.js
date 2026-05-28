import { ref } from "vue";
import config from "@/config";
import useFetch from "@/composables/useFetch"

export default function useCards() {
  const cards = ref([]);
  const totalResults = ref(0);
  const hasMore = ref(true);
  const currentOffset = ref(0);
  const { result, error, loading, fetchData } = useFetch();
  let currentRequestId = 0;
  let isFetchingMore = false;
  
  const getCards = async (qs = {}, append = false) => {
    const requestId = ++currentRequestId;
    
    if (!append) {
      cards.value = [];
      currentOffset.value = 0;
      hasMore.value = true;
      isFetchingMore = false;
    }

    if (isFetchingMore && append) {
      console.log('[useCards] Fetch already in progress, skipping');
      return;
    }

    if (append) {
      isFetchingMore = true;
    }

    await fetchData(config.cardInfo, qs);

    if (requestId !== currentRequestId) {
      console.log(`[useCards] Stale response discarded (request ${requestId} vs ${currentRequestId})`);
      isFetchingMore = false;
      return;
    }

    if (!result.value) {
      console.warn("[useCards] No valid data from API");
      if (!append) {
        cards.value = [];
        totalResults.value = 0;
        hasMore.value = false;
      }
      isFetchingMore = false;
      return;
    }

    console.log(`[useCards] API Response analysis:`, {
      hasData: !!result.value.data,
      dataLength: Array.isArray(result.value.data) ? result.value.data.length : 'N/A',
      totalCount: result.value.totalCount,
      rawKeys: result.value.raw ? Object.keys(result.value.raw) : 'N/A',
      rawCount: result.value.raw?.count,
      rawTotal: result.value.raw?.total
    });

    const apiData = Array.isArray(result.value.data) ? result.value.data : [];
    const apiTotal = result.value.totalCount ?? apiData.length;

    console.log(`[useCards] Extracted apiTotal: ${apiTotal} (from totalCount: ${result.value.totalCount}, fallback to data.length: ${apiData.length})`);

    if (!Array.isArray(apiData)) {
      console.warn("[useCards] API returned non-array data");
      if (!append) {
        cards.value = [];
        totalResults.value = 0;
        hasMore.value = false;
      }
      isFetchingMore = false;
      return;
    }

    const data = apiData.map(c => {
      if (!c) return null;
      return {
        id: c.id,
        atk: c?.atk,
        def: c?.def,
        name: c.name,
        race: c.race,
        type: c.type,
        level: c?.level,
        attribute: c?.attribute,
        frameType: c?.frameType,
        desc: c?.desc,
        rarity: c?.card_sets?.[0]?.set_rarity || c?.card_sets?.[0]?.rarity || '',
        image: c.card_images?.[0]?.image_url || '',
      };
    }).filter(Boolean);

    if (append) {
      cards.value = [...cards.value, ...data];
    } else {
      cards.value = data;
    }

    totalResults.value = apiTotal;
    currentOffset.value = (currentOffset.value || 0) + data.length;
    
    const isFullBatch = data.length >= 100;
    const reachedTotal = apiTotal > 0 && cards.value.length >= apiTotal;
    hasMore.value = !reachedTotal && (data.length > 0 || isFullBatch);
    
    console.log(`[useCards] Pagination state:`, {
      apiTotal,
      cardsLength: cards.value.length,
      dataLength: data.length,
      isFullBatch,
      reachedTotal,
      hasMore: hasMore.value
    });
    isFetchingMore = false;
  };

  const loadMore = async (buildParams) => {
    if (!hasMore.value || isFetchingMore || loading.value) {
      console.log('[useCards] loadMore skipped:', { hasMore: hasMore.value, isFetchingMore, loading: loading.value });
      return;
    }

    const params = buildParams(currentOffset.value);
    console.log(`[useCards] Loading more at offset ${currentOffset.value}`);
    await getCards(params, true);
  };

  const resetState = () => {
    cards.value = [];
    totalResults.value = 0;
    hasMore.value = true;
    currentOffset.value = 0;
    isFetchingMore = false;
  };

  return { 
    cards, 
    error, 
    loading, 
    totalResults, 
    hasMore, 
    getCards, 
    loadMore, 
    resetState 
  };
}
