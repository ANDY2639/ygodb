import { createSerializer, parseAsString, parseAsInteger } from 'nuqs/server';

export const apiParams = {
  fuzzyName: parseAsString,
  archetype: parseAsString,
  race: parseAsString,
  attribute: parseAsString,
  type: parseAsString,
  atk: parseAsString,
  def: parseAsString,
  level: parseAsString,
  scale: parseAsString,
  link: parseAsString,
  page: parseAsInteger,
  limit: parseAsInteger,
} as const;

export const serializeApi = createSerializer(apiParams);
