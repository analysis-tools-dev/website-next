# Analysis Tools Dev - Modernization Roadmap

This document tracks the ongoing modernization effort for the analysis-tools.dev website.

---

## ✅ Completed

### Phase 1: Static Data Layer Migration
- [x] Created repository pattern (`ToolsRepository`, `TagsRepository`, `VotesRepository`, `StatsRepository`, `ToolsFilter`)
- [x] Migrated tools page to `getStaticProps` with `ToolsProvider` context for client-side filtering
- [x] Migrated tag pages (`/tag/[slug]`) to static generation
- [x] Migrated tool pages (`/tool/[slug]`) to static generation

### Phase 2: Legacy Code Cleanup
- [x] Deleted unused API routes (`tools`, `paginated-tools`, `tags`, `mostViewed`, `popularLanguages`, etc.)
- [x] Removed React Query hooks and related queries/components for tools, homepage, and blog
- [x] Deleted legacy `SearchProvider` context and old `ListPageComponent`
- [x] Removed unused utilities and cache logic from `utils-api/`
- [x] Simplified blog and screenshot utilities to remove cache dependencies

### Bug Fixes
- [x] Fixed Next.js 13+ `<Link>` component issue in `AffiliateCard.tsx` (removed nested `<a>` tag)
- [x] Fixed Algolia indexing script to read from static `data/tools.json` instead of deleted `/api/tools` endpoint
- [x] Fixed sorting by votes - votes are now fetched during prebuild and included in static `tools.json`

### Major Simplification: Votes in Static Data
- [x] Updated `build-data.ts` to fetch votes from Firestore and include them in `tools.json`
- [x] Removed `VotesRepository` class entirely - no longer needed
- [x] Simplified all pages (`/tools`, `/tag/[slug]`, `/tool/[slug]`, `/index`, `/languages`) to use static data
- [x] Removed `withVotes()` and `withVotesAsArray()` methods from `ToolsRepository`
- [x] Simplified `StatsRepository` - no longer needs votes parameter
- [x] Removed `FIREBASE_TOKEN` secret dependency - uses Google Cloud Workload Identity Federation
- [x] Cleaned up Dockerfile - removed unused `PROJECT_ID` and `FIREBASE_PROJECT_ID` env vars

### Code Quality
- [x] Audited and removed all deprecated `passHref` props from `<Link>` components (11 instances)
- [x] Fixed TypeScript issues in `TagPage` filter logic - created shared `FilterKey` and `FiltersState` types
- [x] Created `@components/tags/types.ts` with shared filter types for type-safe filter operations

### DevOps
- [x] Removed Pulumi and replaced deployment with `gcloud run deploy` in CI

---

## 🔄 In Progress

- [ ] Review and merge `phase2/cleanup-old-code` branch

---

## 📋 Short-term Tasks

### Code Quality
- [x] Audit remaining components for deprecated Next.js 12 patterns (`<Link>` with `passHref` where not needed)
- [x] Remove `passHref` prop from `<Link>` components that don't wrap custom components
- [x] Add TypeScript strict mode or fix existing type ignores (see `TagPage` filter logic)

### Performance
- [ ] Optimize `/tools` page data payload (~500KB triggers Next.js warnings)
  - Consider pagination or lazy loading for tool data
  - Evaluate splitting data by category/language
- [ ] Implement incremental static regeneration (ISR) for frequently updated pages

---

## 📅 Medium-term Tasks

### Architecture
- [x] Remove React Query entirely once voting is refactored to not use it
- [x] Evaluate moving votes to static generation with client-side updates
- [x] Consider migrating blog/articles API to full static generation

### Search & Filtering
- [ ] Implement Algolia InstantSearch for superior search/filtering UX
- [ ] Address InstantSearch `future.preserveSharedStateOnUnmount` warning

### Testing
- [ ] Add integration tests for critical user flows
- [ ] Add unit tests for repository classes and filters

---

## 🎯 Long-term Goals

### Infrastructure
- [ ] Evaluate fully static hosting (e.g., Vercel static export, Cloudflare Pages)
- [ ] Consider edge functions for dynamic features (voting)

### Developer Experience
- [ ] Document the new architecture and data flow for contributors
- [ ] Create component storybook for UI components
- [ ] Add pre-commit hooks for linting and type checking

### Features
- [ ] Implement tool comparison feature
- [ ] Add user accounts for personalized tool recommendations
- [ ] Expand affiliate/sponsor integration

---

## 📝 Notes

- **Page Data Size**: The `/tools` page sends ~500KB to the client. Not a blocker but should be optimized.
- **Deployment**: Pulumi has been removed. Deployments now use `gcloud run deploy` directly in CI.
- **Next.js Version**: Currently on 15.5.0. Keep updated for performance and security improvements.
- **Credentials**: `GOOGLE_APPLICATION_CREDENTIALS` is **required** for builds. The build will fail fast if not set. In CI/CD, this is automatically set by Google Cloud Workload Identity Federation. For local dev, you need a service account key.
- **Votes**: Votes are fetched from Firestore during `npm run build-data` (prebuild) and baked into `tools.json`. This means sorting by votes works correctly and no Firestore access is needed during `next build`.
- **Secrets to Delete**: `FIREBASE_TOKEN`, `PROJECT_ID`, `ORG_ID` are no longer used and can be removed from GitHub.
- **Local Development**: To run `npm run build` locally, you need to set `GOOGLE_APPLICATION_CREDENTIALS` to a valid service account key file with Firestore access.

---

## 🔗 Related Resources

- [Next.js 13+ Link Component Migration](https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor)
- [Algolia InstantSearch Documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/)
- [Static Generation with getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)