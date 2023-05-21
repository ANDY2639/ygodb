import { ref } from "vue";
import config from "@/config";
import useFetch from "@/composables/useFetch"

export default function useArchetypes() {
  const archetypes = ref([]);
  const { result, fetchData } = useFetch();
  
  const getArchetypes = async () => {
    await fetchData(config.archetypes);
    archetypes.value = result.value.map(ar => ar.archetype_name);
  }

  return { archetypes, getArchetypes };
}