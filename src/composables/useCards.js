import { ref } from "vue";
import config from "@/config";
import useFetch from "@/composables/useFetch"

export default function useCards() {
  const cards = ref(null);
  const { result, error, loading, fetchData } = useFetch();
  
  const getCards = async (qs = {}) => {
    await fetchData(config.cardInfo, qs)

    const data = result.value.map(c => {
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
        image: c.card_images[0].image_url,
      }
    });

    cards.value = data;
  }

  return { cards, error, loading, getCards };
}