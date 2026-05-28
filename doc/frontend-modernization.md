# YGODB — Frontend Modernization Plan

## Overview

Modernize the YGODB frontend (Yu-Gi-Oh! card database) by migrating from Bootstrap 5 + SCSS to **TailwindCSS v4 + DaisyUI v5**, implementing URL-based search/filter persistence, and adding loading skeletons — **without altering any existing business logic, data flow, or application behavior**.

---

## Current Architecture

### Stack
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Router:** Vue Router 4 (History mode)
- **Styling:** Bootstrap 5 + SCSS + Bootstrap Icons
- **Build:** Vite 4
- **API:** YGOProDeck API (external)

### File Structure
```
src/
├── main.js                    # Entry: imports Bootstrap JS + SCSS
├── App.vue                    # Root: NavBar + <router-view>
├── routes/index.js            # 2 routes: Home (/), Detail (/detail/:id)
├── config/index.js            # API endpoint URLs (env-based)
├── composables/
│   ├── useFetch.js            # Generic fetch (loading/error/result)
│   ├── useCards.js            # Card list + data transformation
│   ├── useCardDetail.js       # Single card detail
│   └── useArchetypes.js       # Archetype names list
├── components/
│   ├── NavBar.vue             # Top navigation (Bootstrap navbar)
│   ├── NavBarDetail.vue       # Detail sub-nav (Bootstrap nav-pills)
│   ├── Cards.vue              # Search/filter panel + card grid
│   ├── Card.vue               # Individual card item
│   └── CardDetail.vue         # Card detail view
└── views/
    ├── Home.vue               # Suspense wrapper around Cards
    └── Detail.vue             # NavBarDetail + CardDetail
```

### Data Flow
```
User → Cards.vue (search/filter)
        → useCards.getCards(qs)
          → useFetch.fetchData(url, qs)
            → YGOProDeck API
              → result.value → transform → cards.value
                → Card.vue (v-for render)
```

---

## Problems Identified

| # | Issue | Files Affected | Severity |
|---|-------|----------------|----------|
| 1 | Bootstrap 5 dependency — must be fully replaced | `main.js`, `main.scss`, all components | Critical |
| 2 | Custom SCSS files and `<style scoped>` blocks everywhere | `_reset.scss`, `main.scss`, all `.vue` files | Critical |
| 3 | No URL-based filter persistence — state lost on refresh/back-forward | `Cards.vue`, `useCards.js` | Critical |
| 4 | No loading skeletons — only `<p>Loading...</p>` | `Home.vue`, `CardDetail.vue` | High |
| 5 | Inline styles (`style="margin-top: 3.25rem"`) | `NavBarDetail.vue`, `Cards.vue` | High |
| 6 | No responsive mobile optimization | All components | High |
| 7 | No accessibility (aria labels, roles, keyboard nav) | All interactive elements | High |
| 8 | No empty state or error state UI | `Cards.vue`, `CardDetail.vue` | Medium |
| 9 | Bootstrap Icons inline SVG | `Cards.vue` | Low |
| 10 | Vite 4 (outdated) | `vite.config.js`, `package.json` | Low |

---

## Skills Discovered (npx autoskills@latest)

| Skill | Purpose | Relevance |
|-------|---------|-----------|
| `vue` | Vue 3 core APIs, composition API | High |
| `vue-best-practices` | Component patterns, reactivity, performance | High |
| `vue-debug-guides` | Debugging references, Tailwind dynamic classes | High |
| `vite` | Vite config, plugins, build optimization | Medium |
| `accessibility` | WCAG guidelines, A11Y patterns | High |
| `frontend-design` | Frontend design patterns | Medium |
| `seo` | SEO best practices | Low |
| `nodejs-best-practices` | Node.js conventions | Low |
| `nodejs-backend-patterns` | Backend patterns | Low |

---

## Implementation Plan

### Phase 1: Infrastructure Setup

#### 1.1 Install Dependencies
```bash
# Remove Bootstrap
npm uninstall bootstrap bootstrap-icons sass

# Install TailwindCSS v4 + DaisyUI v5
npm install -D tailwindcss@latest @tailwindcss/vite daisyui@latest
```

#### 1.2 Replace CSS Entry Point

**Delete:** `src/assets/scss/main.scss`
**Delete:** `src/assets/scss/_reset.scss`

**Create:** `src/assets/css/main.css`
```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

#### 1.3 Update `main.js`
- Remove Bootstrap JS import
- Remove SCSS import
- Import new `main.css`

#### 1.4 Update `vite.config.js`
- Add `@tailwindcss/vite` plugin

#### 1.5 Update `index.html`
- Add `data-theme` attribute support
- Ensure viewport meta is correct

---

### Phase 2: URL-Based Search & Filter Persistence

#### 2.1 Create `useUrlFilters.js` Composable

**File:** `src/composables/useUrlFilters.js`

**Responsibilities:**
- Read initial filter state from `useRoute().query`
- Sync filter changes to URL via `useRouter().push()` with `query` params
- Support browser back/forward navigation (Vue Router handles history)
- Provide `syncFilters(filters)` and `getFilters()` methods
- Debounce URL updates to avoid history spam

**URL Query Params Mapping:**
| UI State | Query Param | Example |
|----------|-------------|---------|
| Search text | `q` | `?q=blue-eyes` |
| Advanced panel open | `advanced` | `?advanced=true` |
| Archetype | `archetype` | `?archetype=Blue-Eyes` |
| Race card | `race` | `?race=monster` |
| Race option | `raceOption` | `?raceOption=Dragon` |
| Attribute | `attribute` | `?attribute=Light` |
| Type | `type` | `?type=Effect+Monster` |
| ATK operator | `atkOp` | `?atkOp=gte` |
| ATK value | `atk` | `?atk=3000` |
| DEF operator | `defOp` | `?defOp=` |
| DEF value | `def` | `?def=2500` |
| Level operator | `lvlOp` | `?lvlOp=lte` |
| Level value | `level` | `?level=8` |
| Scale operator | `scaleOp` | `?scaleOp=` |
| Scale value | `scale` | `?scale=4` |
| Link operator | `linkOp` | `?linkOp=` |
| Link value | `link` | `?link=4` |

#### 2.2 Refactor `Cards.vue`
- Replace local `ref`/`reactive` state with `useUrlFilters` composable
- `sendRequest()` → sync to URL, trigger fetch
- `advanceSearch()` → sync all filters to URL
- `changeSwitch()` → toggle `?advanced=true/false`
- Initialize all form values from URL on mount

#### 2.3 Update `useCards.js`
- `getCards()` receives params from URL-based state
- No logic change — only the source of params changes

---

### Phase 3: Component Migration (Bootstrap → DaisyUI + TailwindCSS)

#### 3.1 NavBar.vue

**Current:**
```html
<nav class="navbar fixed-top bg-body-tertiary bg-primary" data-bs-theme="dark">
  <div class="container">
    <router-link :to="{ name: 'Home' }" class="enlace">Home</router-link>
  </div>
</nav>
```

**Migration:**
- `navbar` → DaisyUI `navbar`
- `bg-primary` → DaisyUI `bg-primary`
- `.enlace` class → `text-primary-content text-2xl no-underline hover:underline`
- Remove `<style>` block entirely

#### 3.2 NavBarDetail.vue

**Current:**
```html
<nav class="nav nav-pills flex-sm-row justify-content-evenly border border-primary p-1" style="margin-top: 3.25rem">
```

**Migration:**
- Replace with DaisyUI `tabs tabs-boxed`
- Remove inline `style` → `mt-16` (Tailwind)
- Active state management (currently hardcoded `active`)

#### 3.3 Cards.vue (Largest Migration)

**Search Input:**
- Bootstrap `form-control` → DaisyUI `input input-bordered w-full`
- Search button with icon → DaisyUI `btn btn-square`
- Filter toggle icon → Use DaisyUI-compatible icon or Heroicons

**Advanced Filter Form:**
- Bootstrap `form-select` → DaisyUI `select select-bordered w-full`
- Bootstrap `row`/`col-*` → Tailwind `grid grid-cols-12 gap-2`
- Bootstrap `btn btn-primary` → DaisyUI `btn btn-primary btn-block`
- Labels → DaisyUI `label` + `fieldset`
- Remove `.lbl` custom class

**Card Grid:**
- Custom `.cards` SCSS grid → Tailwind `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- Remove entire `<style scoped>` block

#### 3.4 Card.vue

**Current:** Custom `.cardinfo` with SCSS nesting

**Migration:**
- Replace with DaisyUI `card card-side bg-base-200 shadow-sm`
- `cardinfo__body` → `card-body`
- `cardinfo__image` → `card-figure` with `w-36`
- `cardinfo__title` → `card-title text-base`
- Remove `<style scoped>` entirely
- Stretched link → DaisyUI card is naturally clickable with `router-link` wrapper

#### 3.5 CardDetail.vue

**Current:** Bootstrap `table table-sm` + custom `.cardDetail` SCSS

**Migration:**
- Bootstrap `table` → DaisyUI `table table-sm`
- Custom headings → DaisyUI `alert` or `card` with `bg-primary text-primary-content`
- `.cardDetail__html` → `prose prose-sm` or `whitespace-pre-line` with Tailwind
- Image container → DaisyUI `card` with `figure`
- Loading state → Skeleton (see Phase 4)
- Remove entire `<style scoped>` block

#### 3.6 Home.vue

**Current:** `<Suspense>` with `<p>Loading...</p>` fallback

**Migration:**
- Replace fallback with full card grid skeleton (see Phase 4)

#### 3.7 Detail.vue

**No changes needed** — only imports components, no styling.

---

### Phase 4: Loading Skeletons

#### 4.1 Card List Skeleton

**File:** New component `src/components/CardSkeleton.vue`

```
DaisyUI card skeleton per item:
- Skeleton rectangle (image area) — w-36 h-48
- Skeleton lines (text lines) — 3 lines of varying width
- Grid of 8 skeleton cards during loading
```

**Usage:**
- `Home.vue` Suspense fallback → `<CardSkeleton />`
- `Cards.vue` during `loading` state → show skeleton grid

#### 4.2 Card Detail Skeleton

**Inline in `CardDetail.vue`:**
- Image skeleton — `w-64 h-96 skeleton`
- Table skeleton — rows of skeleton rectangles
- Heading skeleton — `skeleton h-8 w-full`

#### 4.3 Search Results Skeleton

- Reuse `CardSkeleton` grid
- Show when `loading && search !== ''`

#### 4.4 Dashboard/Initial Load Skeleton

- `Home.vue` initial mount → skeleton grid
- Match final layout to avoid layout shift

---

### Phase 5: UX/UI Improvements

#### 5.1 Visual Hierarchy
- Use DaisyUI semantic colors consistently (`base-100`, `base-200`, `primary`)
- Proper heading sizes (`text-xl`, `text-lg`, `text-sm`)
- Consistent spacing scale (`gap-4`, `p-4`, `m-2`)

#### 5.2 Responsive Behavior
- Mobile-first grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Filter panel: collapsible on mobile (DaisyUI `collapse`)
- Card detail: stacked on mobile, side-by-side on `md+`

#### 5.3 Accessibility
- Add `aria-label` to search input
- Add `role="search"` to search form
- Add `aria-busy="true"` during loading
- Keyboard navigation for filter panel
- Proper `<label>` associations for all form inputs
- Focus-visible styles (DaisyUI handles this)

#### 5.4 Loading States
- DaisyUI `loading loading-spinner` for button states
- Skeleton for content areas
- Disable inputs during loading

#### 5.5 Error States
- DaisyUI `alert alert-error` for API errors
- Retry button on error
- Empty state when no results found

#### 5.6 Empty States
- "No cards found" message with DaisyUI `alert alert-info`
- Suggest clearing filters

---

## File Change Summary

| File | Action | Changes |
|------|--------|---------|
| `package.json` | Modify | Remove Bootstrap/SCSS, add TailwindCSS/DaisyUI |
| `vite.config.js` | Modify | Add `@tailwindcss/vite` plugin |
| `index.html` | Modify | Add theme support |
| `src/main.js` | Modify | Remove Bootstrap imports, add CSS import |
| `src/assets/scss/main.scss` | **DELETE** | Replaced by TailwindCSS |
| `src/assets/scss/_reset.scss` | **DELETE** | Replaced by TailwindCSS reset |
| `src/assets/css/main.css` | **CREATE** | TailwindCSS + DaisyUI imports |
| `src/composables/useUrlFilters.js` | **CREATE** | URL-based filter persistence |
| `src/components/CardSkeleton.vue` | **CREATE** | Loading skeleton for cards |
| `src/components/NavBar.vue` | Modify | Bootstrap → DaisyUI |
| `src/components/NavBarDetail.vue` | Modify | Bootstrap → DaisyUI tabs |
| `src/components/Cards.vue` | Modify | Bootstrap → DaisyUI + URL filters |
| `src/components/Card.vue` | Modify | Custom CSS → DaisyUI card |
| `src/components/CardDetail.vue` | Modify | Bootstrap → DaisyUI + skeleton |
| `src/views/Home.vue` | Modify | Skeleton fallback |
| `src/routes/index.js` | No change | Routes preserved |
| `src/config/index.js` | No change | Config preserved |
| `src/composables/useFetch.js` | No change | Logic preserved |
| `src/composables/useCards.js` | Modify | Accept params from URL filters |
| `src/composables/useCardDetail.js` | No change | Logic preserved |
| `src/composables/useArchetypes.js` | No change | Logic preserved |
| `src/views/Detail.vue` | No change | Component composition preserved |

---

## Technical Constraints (Permanent Rules)

- **NEVER** use inline CSS (`style="..."`)
- **NEVER** use custom CSS files or `<style>` blocks
- **NEVER** use CSS modules, styled-components, emotion, or handcrafted CSS
- **ALWAYS** use only TailwindCSS utility classes and DaisyUI components
- **ALWAYS** use DaisyUI semantic colors (`base-*`, `primary`, `secondary`, etc.)
- **DO NOT** modify backend logic or API data flow
- **DO NOT** break existing routes, filters, navigation, or user flows
- **PRESERVE** all current business logic 100%

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TailwindCSS v4 compatibility with Vite 4 | Medium | May need to upgrade Vite to v5 |
| URL filter state desync with component state | Low | Use Vue Router watch on route.query |
| Layout shift during skeleton → content transition | Low | Match skeleton dimensions to final content |
| Breaking existing filter logic during refactor | Medium | Keep `useCards.js` API contract identical |
| DaisyUI theme color mismatch with current design | Low | Use `base-*` colors for neutral elements |

---

## Execution Order

```
Phase 1 (Infrastructure)
    ↓
Phase 2 (URL Filters — composable only)
    ↓
Phase 3 (Component Migration — one component at a time)
    ├── 3.1 NavBar.vue
    ├── 3.2 NavBarDetail.vue
    ├── 3.3 Cards.vue (integrates Phase 2)
    ├── 3.4 Card.vue
    ├── 3.5 CardDetail.vue
    └── 3.6 Home.vue
    ↓
Phase 4 (Loading Skeletons)
    ↓
Phase 5 (UX/UI Polish)
```

Each phase is independently testable. No phase breaks functionality from previous phases.

---

## Success Criteria

- [x] Zero Bootstrap/SCSS dependencies in `package.json`
- [x] Zero `<style>` blocks in any `.vue` file
- [x] Zero inline `style` attributes in templates
- [x] All styling uses only TailwindCSS utilities + DaisyUI components
- [x] Search/filters persist in URL query params
- [x] Browser back/forward preserves filter state
- [x] Page refresh restores filter state
- [x] Loading skeletons for all async content
- [x] No layout shift during loading → loaded transition
- [x] All existing functionality works identically
- [x] Responsive on mobile (320px+), tablet, desktop
- [x] Accessible form inputs with proper labels
- [x] Error states displayed with DaisyUI alerts
- [x] Empty states displayed when no results

---

## Implementation Status: COMPLETED

All 5 phases have been fully implemented and verified.

### Final Stack
- **Framework:** Vue 3.5.35 (Composition API, `<script setup>`)
- **Router:** Vue Router 4 (History mode)
- **Styling:** TailwindCSS v4.3.0 + DaisyUI v5.5.20
- **Build:** Vite 8.0.14
- **API:** YGOProDeck API (external)

### Final Bundle Size
- **CSS:** 99.73 kB (16.26 kB gzipped)
- **JS:** 115.66 kB (41.88 kB gzipped)

### Files Created
- `src/assets/css/main.css` — TailwindCSS + DaisyUI entry point
- `src/composables/useUrlFilters.js` — URL-based filter persistence composable
- `src/components/CardSkeleton.vue` — Reusable card loading skeleton

### Files Deleted
- `src/assets/scss/main.scss`
- `src/assets/scss/_reset.scss`

### Dependencies Removed
- `bootstrap`
- `bootstrap-icons`
- `sass`
- `@popperjs/core`

### Dependencies Added
- `tailwindcss@4.3.0`
- `@tailwindcss/vite@4.3.0`
- `daisyui@5.5.20`

### Dependencies Upgraded
- `vite` 4 → 8
- `@vitejs/plugin-vue` 4 → 6

### Bugs Fixed During Implementation
1. **Double fetch** — `sendRequest()`/`advanceSearch()` called `getCards()` directly AND the route watcher also called it. Fixed by consolidating all fetch logic into `watch(route.query, { immediate: true })`.
2. **Form labels not associated** — `<label>` elements had no `for` attribute. Fixed by adding `id` to every input and matching `for` to every label.
3. **Loading skeleton broken on re-search** — `useFetch.js` set `loading = true` once at creation, never reset inside `fetchData()`. Fixed by moving `loading.value = true` inside `fetchData()`.
4. **Card.vue missing `relative` class** — Absolute router-link overlay was broken. Fixed by adding `relative` to card container.
5. **Skeleton showing on initial load** — `useFetch` initializes `loading` as `true`, causing skeleton to show before any search. Fixed with `searched` ref guard.
6. **Browser back/forward not triggering fetch** — Route watcher only updated form state. Fixed by adding `{ immediate: true }` and fetch call to watcher.
7. **`racecard` not reset on filter close** — `resetFilters()` didn't clear `racecard`. Fixed by adding `racecard.value = null`.
8. **`v-for` + `v-if` on same element** — Vue 3 warning. Fixed with `<template>` wrapper.
