# Divyanshu Kashyap Portfolio

Frontend engineer portfolio (React / Next.js / TypeScript).

## SEO & performance notes

- Meta title/description/OG/Twitter live in `app/layout.tsx` + `lib/seo.ts`
- JSON-LD: Person, WebSite, FAQPage
- `app/sitemap.ts` + `app/robots.ts`
- FAQ accordion uses native `<details>` (good for accessibility + INP)
- Set production URL: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`

## Scripts

```bash
npm run dev
npm run build
```
