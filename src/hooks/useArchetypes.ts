import { useQuery } from '@tanstack/react-query';
import { config } from '@/config';

interface ArchetypesResponse {
  data: Array<{ type: string; id: string; attributes: {} }>;
}

export function useArchetypes() {
  return useQuery({
    queryKey: ['archetypes'],
    queryFn: async () => {
      const res = await fetch(config.endpoints.archetypes);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json() as ArchetypesResponse;
      return json.data.map((a) => a.id);
    },
    staleTime: 5 * 60 * 1000,
  });
}
