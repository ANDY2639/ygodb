import { ref } from "vue";
import config from "@/config";
import useFetch from "@/composables/useFetch"

export default function useCardDetail() {
  const card = ref(null);
  const { result, error, loading, fetchData } = useFetch();
  let currentRequestId = 0;
  
  const getCardDetail = async (qs = {}) => {
    const requestId = ++currentRequestId;
    await fetchData(config.cardInfo, qs);

    if (requestId !== currentRequestId) {
      console.log(`[useCardDetail] Stale response discarded (request ${requestId} vs ${currentRequestId})`);
      return;
    }

    if (!result.value) {
      console.warn("[useCardDetail] No valid data from API");
      card.value = null;
      return;
    }

    const apiData = result.value.data || result.value.raw?.data || result.value;
    const dataArray = Array.isArray(apiData) ? apiData : [];

    if (dataArray.length === 0) {
      console.warn("[useCardDetail] No cards found in response");
      card.value = null;
      return;
    }

    const c = dataArray[0];
    card.value = {
      id: c.id,
      atk: c?.atk,
      def: c?.def,
      name: c.name,
      race: c.race,
      type: c.type,
      desc: c.desc,
      level: c?.level,
      linkval: c?.linkval,
      attribute: c?.attribute,
      archetype: c?.archetype,
      frameType: c?.frameType,
      image: c.card_images?.[0]?.image_url || '',
    };

    console.log(`[useCardDetail] Loaded: ${card.value.name} — image: ${card.value.image}`);
  };

  return { card, error, loading, getCardDetail };
}
