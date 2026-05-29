import { useQueryStates, parseAsString, parseAsBoolean } from 'nuqs';

const filterParsers = {
  q: parseAsString.withDefault(''),
  advanced: parseAsBoolean.withDefault(false),
  race: parseAsString,
  archetype: parseAsString.withDefault(''),
  raceOption: parseAsString.withDefault(''),
  attribute: parseAsString.withDefault(''),
  type: parseAsString.withDefault(''),
  atkOp: parseAsString.withDefault('='),
  atk: parseAsString.withDefault(''),
  defOp: parseAsString.withDefault('='),
  def: parseAsString.withDefault(''),
  lvlOp: parseAsString.withDefault('='),
  level: parseAsString.withDefault(''),
  scaleOp: parseAsString.withDefault('='),
  scale: parseAsString.withDefault(''),
  linkOp: parseAsString.withDefault('='),
  link: parseAsString.withDefault(''),
};

export function useCardFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
  });

  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    if (filters.q) params.fuzzyName = filters.q;
    if (filters.archetype) params.archetype = filters.archetype;
    if (filters.race) params.race = filters.race;
    if (filters.raceOption) params.race = filters.raceOption;
    if (filters.attribute) params.attribute = filters.attribute;
    if (filters.type) params.type = filters.type;

    const mapOp = (signe: string, val: string) => {
      if (!val) return undefined;
      return signe === '=' ? val : `${signe}${val}`;
    };

    const atkVal = mapOp(filters.atkOp, filters.atk);
    if (atkVal) params.atk = atkVal;
    const defVal = mapOp(filters.defOp, filters.def);
    if (defVal) params.def = defVal;
    const levelVal = mapOp(filters.lvlOp, filters.level);
    if (levelVal) params.level = levelVal;
    const scaleVal = mapOp(filters.scaleOp, filters.scale);
    if (scaleVal) params.scale = scaleVal;
    const linkVal = mapOp(filters.linkOp, filters.link);
    if (linkVal) params.link = linkVal;

    return params;
  };

  const resetFilters = () => setFilters(null);

  return {
    filters,
    setFilters,
    buildQueryParams,
    resetFilters,
  };
}
