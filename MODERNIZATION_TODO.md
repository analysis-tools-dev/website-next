# Modernization TODO List

This document outlines the steps needed to modernize the analysis-tools.dev website by simplifying the backend and leveraging modern tools: **Algolia + InstantSearch + Headless UI + Static JSON/CMS**.

## Current Architecture Overview

The current setup has several layers of complexity:
- Next.js with Server-Side Rendering (SSR) and API routes
- Firebase/Firestore for votes storage
- GitHub API for fetching tools data from external repos
- File-based caching (`cache-manager-fs-hash`)
- Custom search context and filtering logic
- React Query for client-side data fetching
- Docker deployment on Google Cloud Run via Pulumi

---

## Phase 1: Data Layer Modernization

### 1.1 Static JSON Data Source
- [x] Create a build-time script to fetch and consolidate `tools.json` from both `static-analysis` and `dynamic-analysis` repos
- [x] Store consolidated data in `data/tools.json` at build time
- [x] Remove runtime GitHub API calls (`utils-api/tools.ts` → `getTools()`) - New utilities in `utils/tools.ts`, `utils/static-data.ts`
- [ ] Remove Octokit dependency (`@octokit/core`) - Keep for now, old code still present
- [ ] Remove file-based cache (`cache-manager`, `cache-manager-fs-hash`) - Keep for now, old code still present
- [ ] Delete `utils-api/cache.ts` - Keep for now, will remove in cleanup phase

### 1.2 Votes Data Migration
- [ ] **Option A**: Migrate votes to Algolia as a field in the tools index
- [ ] **Option B**: Use a lightweight service (e.g., Supabase, PlanetScale) for votes
- [x] **Option C**: Keep Firebase but simplify to client-side only voting - Implemented `utils/firebase-votes.ts`
- [ ] Remove server-side Firebase Admin SDK (`firebase-admin`) - Still needed for votes
- [ ] Delete `firebase-key.json` and related credentials handling - Still needed
- [ ] Remove `utils-api/firebase.ts` - Keep for now, will remove in cleanup phase
- [ ] Remove `utils-api/votes.ts` server-side logic - Keep for now, API routes still use it
- [x] Simplify or remove `utils-api/toolsWithVotes.ts` - New `utils/tools-with-votes.ts` created

### 1.3 Remove API Routes
- [ ] Delete `pages/api/tools.ts` - Keep for now, tools page still uses it
- [ ] Delete `pages/api/paginated-tools.ts` - Keep for now, tools page still uses it
- [ ] Delete `pages/api/tags/*` - Keep for now
- [ ] Delete `pages/api/vote/*` - Keep for now, voting still works via API
- [ ] Delete `pages/api/votes/*` - Keep for now
- [ ] Delete `pages/api/mostViewed.ts` - Keep for now
- [ ] Delete `pages/api/popularLanguages.ts` - Keep for now
- [ ] Delete `pages/api/articles.ts` (if not needed) - Keep for now
- [ ] Remove entire `utils-api/` directory (migrate necessary utils to `utils/`) - Partially done

### 1.4 New Static Data Utilities (Phase 1 Additions)
- [x] Created `scripts/build-data.ts` - Build-time data fetching script
- [x] Created `utils/static-data.ts` - Static data reader utility
- [x] Created `utils/tools.ts` - Simplified tools utility
- [x] Created `utils/tools-with-votes.ts` - Tools with votes merger
- [x] Created `utils/firebase-votes.ts` - Simplified Firebase votes utility
- [x] Created `utils/tags.ts` - Simplified tags utility
- [x] Created `utils/filters.ts` - Filtering utility (moved from utils-api)
- [x] Created `utils/stats.ts` - Stats utility for views data
- [x] Updated `package.json` with `build-data` script and `prebuild` hook
- [x] Updated `.gitignore` to exclude generated data files
- [x] Updated `Dockerfile` to use new build process
- [x] Updated `.github/workflows/deploy.yml` to use generated data for hashing
- [x] Updated `pages/index.tsx` to use new static data utilities
- [x] Updated `pages/tool/[slug].tsx` to use new static data utilities
- [x] Updated `pages/tag/[slug].tsx` to use new static data utilities

---

## Phase 2: Search & Filtering with Algolia + InstantSearch

### 2.1 Algolia Index Enhancement
- [ ] Enhance `algolia-index.ts` to run at build time (not from deployed API)
- [ ] Add all filterable attributes to Algolia index:
  - `languages` (facet)
  - `categories` (facet)
  - `types` (facet)
  - `licenses` (facet)
  - `pricing`/`plans` (facet)
  - `votes` (for sorting)
  - `deprecated` (filter)
- [ ] Configure Algolia dashboard:
  - Set up facets for filtering
  - Configure searchable attributes ranking
  - Set up sorting indices (by votes, by name, etc.)

### 2.2 InstantSearch Integration
- [ ] Upgrade `react-instantsearch` to latest version
- [ ] Replace custom `SearchProvider` (`context/SearchProvider.tsx`) with InstantSearch provider
- [ ] Delete `context/SearchProvider.tsx`
- [ ] Replace `utils-api/filters.ts` logic with Algolia facets
- [ ] Create new InstantSearch widgets:
  - [ ] `SearchBox` component
  - [ ] `RefinementList` for language filters
  - [ ] `RefinementList` for category filters
  - [ ] `RefinementList` for type filters
  - [ ] `RefinementList` for license filters
  - [ ] `RefinementList` for pricing filters
  - [ ] `SortBy` component for sorting
  - [ ] `Hits` component for results
  - [ ] `Pagination` or `InfiniteHits` component

### 2.3 Replace Custom Data Fetching
- [ ] Remove React Query (`@tanstack/react-query`) for tools fetching
- [ ] Delete `components/tools/queries/tools.ts`
- [ ] Delete `components/tools/queries/languages.ts`
- [ ] Delete `components/tools/queries/others.ts`
- [ ] Delete `components/tools/queries/index.ts`
- [ ] Keep React Query only if needed for non-search data (blog posts, etc.)

---

## Phase 3: UI Modernization with Headless UI

### 3.1 Replace Custom UI Components
- [ ] Install `@headlessui/react`
- [ ] Replace custom dropdown (`components/elements/Dropdown`) with Headless UI `Listbox`
- [ ] Replace mobile filters drawer with Headless UI `Dialog`
- [ ] Create accessible filter components using Headless UI:
  - [ ] `Disclosure` for collapsible filter sections
  - [ ] `Combobox` for searchable language selector
  - [ ] `Switch` for toggle filters (e.g., "Show deprecated")
  - [ ] `Popover` for filter tooltips/info

### 3.2 Component Cleanup
- [ ] Audit and simplify `components/elements/`
- [ ] Remove unused components
- [ ] Standardize component patterns with Headless UI

---

## Phase 4: Page Architecture Simplification

### 4.1 Convert SSR Pages to Static (SSG)
- [ ] Convert `pages/tools/index.tsx` from `getServerSideProps` to `getStaticProps`
- [ ] All filtering/search handled client-side via InstantSearch
- [ ] Keep `pages/tool/[slug].tsx` as static (`getStaticProps` + `getStaticPaths`) ✓ (already done)
- [ ] Keep `pages/tag/[slug].tsx` as static ✓ (already done)
- [ ] Consider Incremental Static Regeneration (ISR) for data freshness

### 4.2 Simplify Page Components
- [ ] Refactor `ListPageComponent.tsx` to use InstantSearch
- [ ] Remove infinite scroll complexity (use Algolia pagination)
- [ ] Remove `useRouterPush` hook for search state (InstantSearch handles URL)
- [ ] Delete `hooks/` directory if no longer needed

### 4.3 Data Flow Cleanup
- [ ] Remove `utils/query.ts` (objectToQueryString)
- [ ] Remove `utils/urls.ts` if only used for API URLs
- [ ] Simplify `utils/constants.ts`

---

## Phase 5: Build & Deployment Simplification

### 5.1 Build Process
- [ ] Create `scripts/build-data.ts`:
  - Fetch tools from GitHub repos
  - Fetch star history (optional, can be removed)
  - Merge and validate data
  - Output to `data/tools.json`
  - Update Algolia index
- [ ] Update `package.json` scripts:
  ```json
  {
    "prebuild": "npm run build-data",
    "build-data": "ts-node scripts/build-data.ts",
    "build": "next build"
  }
  ```
- [ ] Remove runtime data fetching from build process

### 5.2 Environment Variables Cleanup
- [ ] Remove `GOOGLE_APPLICATION_CREDENTIALS`
- [ ] Remove `GH_TOKEN` (if data is fetched at build time from public repos)
- [ ] Keep only:
  - `ALGOLIA_APP_ID`
  - `ALGOLIA_API_KEY` (search-only key for client)
  - `ALGOLIA_ADMIN_KEY` (for indexing, build-time only)
  - `PUBLIC_HOST`

### 5.3 Docker & Deployment
- [ ] Simplify `Dockerfile` (no credentials needed at runtime)
- [ ] Consider static export (`next export`) if no server features needed
- [ ] Evaluate moving from Cloud Run to static hosting (Vercel, Netlify, Cloudflare Pages)
- [ ] Simplify or remove Pulumi infrastructure if using static hosting
- [ ] Update `.github/workflows/deploy.yml`

---

## Phase 6: CMS Integration (Optional)

### 6.1 Content Management
- [ ] Evaluate CMS options for non-tool content:
  - Blog posts (currently markdown in `data/blog/`)
  - FAQ content (`data/faq.json`)
  - Sponsors (`data/sponsors.json`)
  - Homepage content (`data/homepage.json`)
- [ ] Consider headless CMS options:
  - Contentlayer (for markdown)
  - Sanity
  - Strapi
  - Directus
- [ ] Or keep as static JSON/Markdown if editorial workflow is simple

---

## Phase 7: Dependency Cleanup

### 7.1 Remove Unused Dependencies
```json
{
  "remove": [
    "@octokit/core",
    "cache-manager",
    "cache-manager-fs-hash",
    "firebase-admin",
    "algoliasearch-helper",
    "@tanstack/react-query"
  ],
  "keep": [
    "algoliasearch",
    "react-instantsearch",
    "next",
    "react",
    "react-dom"
  ],
  "add": [
    "@headlessui/react"
  ]
}
```

### 7.2 DevDependencies Cleanup
- [ ] Remove unused type definitions
- [ ] Update ESLint config for simplified codebase
- [ ] Consider switching to Biome or similar for faster linting

---

## Phase 8: Code Quality & Maintenance

### 8.1 TypeScript Improvements
- [ ] Remove all `@ts-nocheck` and `@ts-ignore` comments
- [ ] Fix type errors in `context/SearchProvider.tsx` (before deletion)
- [ ] Ensure strict TypeScript throughout

### 8.2 Testing
- [ ] Add unit tests for data transformation utilities
- [ ] Add integration tests for search functionality
- [ ] Add E2E tests for critical user flows

### 8.3 Documentation
- [ ] Update `README.md` with new architecture
- [ ] Document new build process
- [ ] Document Algolia configuration
- [ ] Create contributing guide for the simplified codebase

---

## Migration Checklist Summary

### Files to Delete
- [ ] `utils-api/` (entire directory)
- [ ] `pages/api/` (entire directory)
- [ ] `context/SearchProvider.tsx`
- [ ] `components/tools/queries/` (entire directory)
- [ ] `firebase-key.json`
- [ ] `algolia-index.js` (keep only `.ts` version)

### Files to Create
- [ ] `scripts/build-data.ts`
- [ ] `components/search/SearchProvider.tsx` (InstantSearch wrapper)
- [ ] `components/search/SearchBox.tsx`
- [ ] `components/search/Filters.tsx`
- [ ] `components/search/Results.tsx`
- [ ] `components/ui/` (Headless UI wrappers)

### Files to Significantly Modify
- [ ] `pages/tools/index.tsx`
- [ ] `pages/index.tsx`
- [ ] `components/tools/listPage/ListPageComponent/ListPageComponent.tsx`
- [ ] `next.config.js`
- [ ] `package.json`
- [ ] `.github/workflows/deploy.yml`
- [ ] `Dockerfile`

---

## Benefits After Modernization

1. **Simpler Architecture**: No server-side API routes, no runtime data fetching
2. **Better Performance**: Static pages with client-side search (instant)
3. **Lower Costs**: Static hosting is cheaper than Cloud Run
4. **Better DX**: Less code to maintain, clearer data flow
5. **Better Search UX**: Algolia InstantSearch provides superior search experience
6. **Accessibility**: Headless UI components are accessible by default
7. **Scalability**: Algolia handles search at any scale
8. **Reliability**: Fewer moving parts = fewer things to break