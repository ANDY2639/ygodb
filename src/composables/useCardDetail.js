import { ref } from "vue";
import config from "@/config";
import useFetch from "@/composables/useFetch"

export default function useCardDetail() {
  const card = ref(null);
  const { result, error, loading, fetchData } = useFetch();
  
  const getCardDetail = async (qs = {}) => {
    await fetchData(config.cardInfo, qs)

    card.value = {
      id: result.value[0].id,
      atk: result.value[0]?.atk,
      def: result.value[0]?.def,
      name: result.value[0].name,
      race: result.value[0].race,
      type: result.value[0].type,
      desc: result.value[0].desc,
      level: result.value[0]?.level,
      linkval: result.value[0]?.linkval,
      attribute: result.value[0]?.attribute,
      archetype: result.value[0]?.archetype,
      frameType: result.value[0]?.frameType,
      image: result.value[0]?.card_images[0].image_url,
    }
  }

  return { card, error, loading, getCardDetail };
}