# ADR 0001: Static Comparison Pages (Tool vs Tool)

## Status
Proposed

## Context
We want a simple, natural flow that helps users compare two tools using the data we already have. This should also attract SEO traffic for queries like “Black vs Prettier” and land users on a static comparison page.

The site already ships static data and content pages, and uses Next.js. We need a plan that:
- Keeps the UX dead simple.
- Uses existing data sources.
- Produces SEO-friendly, crawlable pages.
- Avoids heavyweight runtime or user-generated content.

## Decision
Create **static comparison pages** for pairs of tools, generated from the current dataset at build time.

### What a comparison page includes
- **Hero**: “Tool A vs Tool B” with short summary.
- **Key differences**: “Languages”, “Categories”, “Licenses”, “Pricing”.
- **Feature/attribute table** (from existing tool fields).
- **Popularity signals** (votes, upvote %).
- **Links** to each tool’s detail page.
- **Call to action** (e.g., “Try Tool A” / “Try Tool B”).

### URL strategy
- A single canonical route:  
  `/compare/[toolA]-vs-[toolB]`
- Slugs derived from existing tool IDs.
- Canonicalization to a deterministic order to avoid duplicates.

### SEO considerations
- Static HTML generated at build time.
- Clear page titles and meta descriptions.
- Internal links from tool detail pages and category pages.

## Tradeoffs
### Pros
- **SEO-friendly**: static pages with clean URLs.
- **Fast**: no runtime data fetching.
- **Simple UX**: direct comparisons.
- **Low risk**: uses existing data.

### Cons
- **Build size/time**: number of tool pairs can explode.
- **Stale data**: depends on build schedule.
- **Limited personalization**: no per-user filtering or saved comparisons.

## Decision Drivers
- Keep UX extremely simple.
- Use existing data immediately.
- Maximize SEO value quickly.
- Avoid runtime complexity.

## Plan of Action
### Phase 1: Scope & Data
1. **Define eligible tools** 
   - only tools with name + slug + categories
   - only tools with the highest votes
   - only tools for the same langauge
   - single-language tools only for now
2. **Select pair generation strategy**:
   - Start with curated pairs (e.g., same category + same language).
   - Limit pairs per tool (e.g., top 5–10 likely comparisons).
   - pick the tools with the highest votes. stop at a reasonable threshold.
3. **Add comparison data helpers**:
   - Normalize labels for categories/licenses/pricing.
   - Compute differences (shared vs unique).

### Phase 2: Page Generation
1. Add new Next.js page:
   - `/pages/compare/[toolA]-vs-[toolB].tsx`.
2. Implement `getStaticPaths`:
   - Generate only curated pairs.
3. Implement `getStaticProps`:
   - Load tool data, map to comparison view model.
4. Add canonical URL handling:
   - Always map to deterministic ordering.

### Phase 3: UX & SEO
1. Add clean page layout.
2. Add meta tags:
   - Title: “Tool A vs Tool B: Comparison”
   - Description: “Compare Tool A and Tool B by language, licensing, pricing, and features.”
3. Add internal links:
   - From tool page: “Compare with similar tools”.

## Alternatives Considered
1. **Dynamic comparisons** (query-based or client-side):
   - More flexible but worse SEO.
2. **User-generated comparisons**:
   - High effort, not needed for MVP.
3. **Comparisons only on tool pages**:
   - Reduces discoverability from SEO.

## Open Questions
- What is the maximum number of comparison pages we want to generate?
  I'm not too worried about that right now. We can use a votes threshold, but a couple hundred static pages is not a problem
- Do we need a curated list of “top comparisons”?
  no.
- What is the build budget (time and size) for these pages?
  doesn't matter

## Next Review
After Phase 1 scope, confirm pair-generation rules and expected number of pages.