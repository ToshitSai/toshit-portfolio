# Nebula AI Architecture

## Request flow

1. User authenticates with Clerk.
2. Dashboard mutations call Server Actions or route handlers.
3. AI generation validates input with Zod and returns a `GeneratedSite` JSON document.
4. The renderer maps structured sections to production React components.
5. The editor stores local draft state in Zustand and can autosave/publish through API routes.
6. Stripe manages subscriptions and webhooks update subscription state.
7. Published sites are served by slug and can be exported as a ZIP.

## Production hardening checklist

- Enable `NEXT_PUBLIC_REQUIRE_AUTH=true`
- Add Clerk OAuth providers for Google and GitHub in Clerk dashboard
- Configure Stripe live products, prices, portal, and webhook signing
- Attach a hosted PostgreSQL database and run Prisma migrations
- Configure UploadThing token and allowed file policies
- Add Redis-backed rate limiting for horizontal scale
- Replace local demo analytics with event ingestion and aggregation
- Add domain verification DNS checks before marking custom domains live
