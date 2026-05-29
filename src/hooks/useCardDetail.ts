import { useQuery } from '@tanstack/react-query';
import { config } from '@/config';
import type { CardDisplay } from './useCards';
import type { CardImage } from '@/types/api';

interface CardApiResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      name: string;
      type: string;
      frameType: string;
      description: string;
      race: string;
      attack?: number;
      defense?: number;
      level?: number;
      attribute?: string;
      archetype?: string;
      images: CardImage[];
      prices: unknown[];
    };
  };
}

export function useCardDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['card', id],
    queryFn: async () => {
      const res = await fetch(config.endpoints.cardById(id!));
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json() as CardApiResponse;
      const c = json.data.attributes;
      return {
        id: json.data.id,
        name: c.name,
        type: c.type,
        frameType: c.frameType,
        description: c.description,
        race: c.race,
        attack: c.attack,
        defense: c.defense,
        level: c.level,
        attribute: c.attribute,
        archetype: c.archetype,
        image: c.images?.[0]?.imageUrl || '',
      } as CardDisplay;
    },
    enabled: !!id,
  });
}
