import { useInfiniteQuery } from '@tanstack/react-query';
import { config } from '@/config';
import { serializeApi } from '@/config/apiSerializer';
import type { CardImage, CardPrice } from '@/types/api';

export interface CardDisplay {
  id: string;
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
  image: string;
}

interface CardsApiResponse {
  data: Array<{
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
      prices: CardPrice[];
    };
  }>;
  meta: { totalItems: number; totalPages: number; currentPage: number; itemsPerPage: number };
}

export function mapCard(
  c: CardsApiResponse['data'][0]['attributes'],
  id: string
): CardDisplay {
  return {
    id,
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
  };
}

export interface CardSearchParams {
  fuzzyName?: string;
  archetype?: string;
  race?: string;
  attribute?: string;
  type?: string;
  atk?: string;
  def?: string;
  level?: string;
  scale?: string;
  link?: string;
}

export function useCards(params: CardSearchParams, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['cards', params],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${config.endpoints.cards}${serializeApi({
        ...params,
        page: pageParam,
        limit: 20,
      })}`;

      console.log('[useCards] Fetching:', url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json() as Promise<CardsApiResponse>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage >= lastPage.meta.totalPages) return undefined;
      return lastPage.meta.currentPage + 1;
    },
    enabled,
  });
}
