import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useUrlFilters() {
  const route = useRoute()
  const router = useRouter()

  const search = ref(route.query.q || '')
  const activeSwitch = ref(route.query.advanced === 'true')
  const racecard = ref(route.query.race || null)

  const advance = ref({
    archetype: route.query.archetype || '',
    race: route.query.raceOption || '',
    attribute: route.query.attribute || '',
    type: route.query.type || '',
  })

  const operator = ref({
    signe_atk: route.query.atkOp || '=',
    atk: route.query.atk || '',
    signe_def: route.query.defOp || '=',
    def: route.query.def || '',
    signe_level: route.query.lvlOp || '=',
    level: route.query.level || '',
    signe_scale: route.query.scaleOp || '=',
    scale: route.query.scale || '',
    signe_link: route.query.linkOp || '=',
    link: route.query.link || '',
  })

  function syncToUrl(replace = false) {
    const query = {}

    if (search.value) query.q = search.value
    if (activeSwitch.value) query.advanced = 'true'
    if (racecard.value) query.race = racecard.value
    if (advance.value.archetype) query.archetype = advance.value.archetype
    if (advance.value.race) query.raceOption = advance.value.race
    if (advance.value.attribute) query.attribute = advance.value.attribute
    if (advance.value.type) query.type = advance.value.type
    if (operator.value.signe_atk && operator.value.signe_atk !== '=') query.atkOp = operator.value.signe_atk
    if (operator.value.atk) query.atk = operator.value.atk
    if (operator.value.signe_def && operator.value.signe_def !== '=') query.defOp = operator.value.signe_def
    if (operator.value.def) query.def = operator.value.def
    if (operator.value.signe_level && operator.value.signe_level !== '=') query.lvlOp = operator.value.signe_level
    if (operator.value.level) query.level = operator.value.level
    if (operator.value.signe_scale && operator.value.signe_scale !== '=') query.scaleOp = operator.value.signe_scale
    if (operator.value.scale) query.scale = operator.value.scale
    if (operator.value.signe_link && operator.value.signe_link !== '=') query.linkOp = operator.value.signe_link
    if (operator.value.link) query.link = operator.value.link

    if (replace) {
      router.replace({ query })
    } else {
      router.push({ query })
    }
  }

  function resetFilters() {
    racecard.value = null
    advance.value = { archetype: '', race: '', attribute: '', type: '' }
    operator.value = {
      signe_atk: '=', atk: '',
      signe_def: '=', def: '',
      signe_level: '=', level: '',
      signe_scale: '=', scale: '',
      signe_link: '=', link: '',
    }
  }

  function buildSearchParams(offset = 0) {
    const params = {}

    if (search.value) {
      params.fname = search.value
    }

    if (advance.value.archetype) params.archetype = advance.value.archetype
    if (advance.value.race) params.race = advance.value.race
    if (advance.value.attribute) params.attribute = advance.value.attribute
    if (advance.value.type) params.type = advance.value.type

    const op = operator.value
    if (op.signe_atk && op.atk) {
      params.atk = op.signe_atk === '=' ? op.atk : `${op.signe_atk}${op.atk}`
    }
    if (op.signe_def && op.def) {
      params.def = op.signe_def === '=' ? op.def : `${op.signe_def}${op.def}`
    }
    if (op.signe_level && op.level) {
      params.level = op.signe_level === '=' ? op.level : `${op.signe_level}${op.level}`
    }
    if (op.signe_scale && op.scale) {
      params.scale = op.signe_scale === '=' ? op.scale : `${op.signe_scale}${op.scale}`
    }
    if (op.signe_link && op.link) {
      params.link = op.signe_link === '=' ? op.link : `${op.signe_link}${op.link}`
    }

    params.num = 100
    params.offset = offset

    return params
  }

  watch(() => route.query, (newQuery) => {
    search.value = newQuery.q || ''
    racecard.value = newQuery.race || null
    advance.value = {
      archetype: newQuery.archetype || '',
      race: newQuery.raceOption || '',
      attribute: newQuery.attribute || '',
      type: newQuery.type || '',
    }
    operator.value = {
      signe_atk: newQuery.atkOp || '=',
      atk: newQuery.atk || '',
      signe_def: newQuery.defOp || '=',
      def: newQuery.def || '',
      signe_level: newQuery.lvlOp || '=',
      level: newQuery.level || '',
      signe_scale: newQuery.scaleOp || '=',
      scale: newQuery.scale || '',
      signe_link: newQuery.linkOp || '=',
      link: newQuery.link || '',
    }
  })

  return {
    search,
    activeSwitch,
    racecard,
    advance,
    operator,
    syncToUrl,
    resetFilters,
    buildSearchParams,
  }
}
