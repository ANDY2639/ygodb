/* ── Card images & prices (actual API shape) ── */

export interface CardImage {
  id: number;
  imageUrl: string;
  imageUrlSmall: string;
  imageUrlCropped: string;
}

export interface CardPrice {
  cardmarketPrice: string;
  tcgplayerPrice: string;
  ebayPrice: string;
  amazonPrice: string;
  coolstuffincPrice: string;
}

/* ── JSON:API envelope ── */

export interface JsonApiEnvelope<T, M = unknown> {
  jsonapi: { version: string };
  links: { self: string; first: string; prev?: string | null; next?: string | null; last: string };
  data: T;
  meta?: M;
}

export interface JsonApiResource<T> {
  type: string;
  id: string;
  attributes: T;
  links?: { self: string };
}

/* ── Archetypes ── */

export interface ArchetypeAttributes {
  archetypeName: string;
}

export type ArchetypeResource = JsonApiResource<ArchetypeAttributes>;

/* ── Sets ── */

export interface SetAttributes {
  setName: string;
  setCode: string;
  numberOfCards: number;
  tcgDate: string;
}

export type SetResource = JsonApiResource<SetAttributes>;

/* ── Errors ── */

export interface JsonApiErrorMeta {
  path: string;
  timestamp: string;
  requestId?: string;
}

export interface JsonApiErrorObject {
  status: string;
  title: string;
  detail: string;
  meta?: JsonApiErrorMeta;
}

export interface JsonApiErrorResponse {
  errors: JsonApiErrorObject[];
}
