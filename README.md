
![CI](https://github.com/snatiagoo/p1-project2/actions/workflows/ci.yml/badge.svg)
### Project 2: API Integration (ships ~Week 5, S-week)

- **What:** Anything that calls an external API and stores/transforms results. Stripe test-mode checkout is ideal — hits the Phase 1 gate and preps Phase 2.
- **Requirements:** Webhook handling. Rate-limit-aware. Error states handled. **NEW: Vitest integration tests for the critical path (checkout flow). GitHub Actions CI running tests on every push.**
- **Success criteria:** Real API call works end-to-end from deployed URL. CI badge green on README.

Design decision → digital product selling page. With Stripe checkout and storage of information from checkout on Neon database, getting user id from auth.



- Product page UI (static, just a buy button)
- Server Action / Route Handler that creates a Stripe Checkout Session and redirects
- Success and cancel pages
- Webhook handler that receives `checkout.session.completed` and stores it in Neon
- Show the stored result somewhere on the page (proof it worked end-to-end)
