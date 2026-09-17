# API Monitor Web

API Monitor Web is the customer-facing application for monitoring critical APIs and verifying a deployment did not regress an API contract. It provides public product onboarding, authenticated monitoring workflows, OpenAPI-assisted contract setup, and release evidence that engineers can use in a deploy decision.

The application is a React 19 and Vite single-page application. Supabase provides authentication and the backend owns all business operations and authorization-sensitive data access.

## Capabilities

- Public landing page that explains the release-verification workflow.
- Email and password authentication through Supabase.
- Dashboard, monitor management, status history, and alert configuration.
- OpenAPI 3.x JSON preview and selected-operation contract monitor setup.
- Named release verification with persistent passed or regressed evidence.
- Responsive layouts and protected routes for authenticated product workflows.

## Prerequisites

- Node.js 20 or later.
- npm 10 or later.
- A running API Monitor backend and Supabase project, or the local development stack described in the backend README.

## Local Development

Install the locked dependency set:

```bash
npm ci
```

Create local configuration. Do not commit `.env.local`.

```bash
cp .env.example .env.local
```

Configure these browser-safe values:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key. This is safe for browser use when RLS is configured. |
| `VITE_API_BASE_URL` | Absolute URL of the API Monitor backend, for example `http://localhost:8000`. |

Start the development server:

```bash
npm run dev
```

Vite prints the local application URL, normally `http://localhost:5173`.

## Routes And User Journey

| Route | Purpose |
| --- | --- |
| `/` | Public product landing page. |
| `/signup`, `/login` | Supabase authentication. |
| `/dashboard` | Monitor health and recent activity. |
| `/monitors` | Create, manage, and inspect uptime and contract monitors. |
| `/alerts` | Configure monitor failure alerts. |
| `/release-verifications` | Preview OpenAPI operations, create contract monitors, and record release decisions. |
| `/settings` | Account and product settings. |

The release-verification workflow is designed for a small, high-signal set of production API operations: paste a non-sensitive OpenAPI 3.x JSON document, choose critical operations, create contract monitors, then run a named verification after a deployment. A failed result displays its HTTP and contract assertion evidence and remains in the release history.

## Quality Checks

Run these commands before publishing frontend changes:

```bash
npm run lint
npm run build
npm run test:e2e
```

The Playwright public suite runs without credentials. To exercise authenticated flows against a controlled environment, provide a disposable account and an already-running target:

```bash
E2E_BASE_URL=https://your-test-app.example.com \
E2E_EMAIL=disposable-test-account@example.com \
E2E_PASSWORD=replace-with-a-test-only-password \
npm run test:e2e
```

Never use a production administrator account or an account containing customer data for end-to-end testing.

## Deployment

The application is configured for Vercel with `npm run build` and `dist` as the output directory. Set the three `VITE_*` variables in the Vercel project before building. Vite embeds these values in the client bundle, so only the Supabase anonymous key and public backend URL belong there.

For a stable production deployment:

1. Deploy the backend and confirm its health endpoint first.
2. Set `VITE_API_BASE_URL` to the stable backend URL and deploy the frontend to its stable domain, for example `https://api-monitor-frontend.vercel.app`.
3. Set the backend `CORS_ORIGINS` to that exact frontend origin.
4. Update the `connect-src` directive in `vercel.json` if the backend domain changes; otherwise the browser will block API requests under the Content Security Policy.
5. Verify the landing page, signup/signin, monitor creation, a passing verification, a controlled regression, evidence persistence, and mobile navigation.

The application uses a single-page-app rewrite so direct navigation to protected routes remains available after deployment. Security headers, including the Content Security Policy, are configured in `vercel.json`.

## Security Boundaries

- Do not add Supabase service-role keys, internal API keys, SMTP credentials, or backend secrets to any `VITE_*` variable.
- Authentication state is established by Supabase; authorization is enforced by the backend and database RLS, not by route visibility alone.
- Treat OpenAPI documents and monitor URLs as potentially sensitive. Use non-sensitive public fixtures for demonstrations and end-to-end tests.
- Keep the frontend backend URL and Content Security Policy aligned so legitimate API requests work without broadly weakening browser protections.

## Related Documentation

- [Master product design](../docs/MASTER_PRODUCT_DESIGN.md)
- [Production release runbook](../docs/PRODUCTION_RELEASE_RUNBOOK.md)
- [Customer discovery guide](../docs/CUSTOMER_DISCOVERY.md)
- [Product demo script](../docs/PRODUCT_DEMO_SCRIPT.md)
