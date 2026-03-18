# Environment Variables Management

## Overview

Environment variables allow you to:
- Store sensitive secrets (API keys, database credentials)
- Configure behavior based on environment (dev, preview, production)
- Keep secrets out of version control

## Local Development (.env.local)

Create `.env.local` file in project root:

```env
# Image Generation APIs
REPLICATE_API_KEY=your_test_api_key_here
STABILITY_API_KEY=your_test_stability_key
OPENAI_API_KEY=your_openai_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_HOURS=1

# Optional: Database (for v2+)
DATABASE_URL=postgresql://user:password@localhost:5432/sticker_db
```

**Important:**
- Add `.env.local` to `.gitignore` (already done in Next.js create-app)
- Never commit this file to Git
- Copy `.env.example` and fill in your keys

## .env.example Template

Create `.env.example` with all required variables but no secret values:

```env
# Image Generation APIs
REPLICATE_API_KEY=
STABILITY_API_KEY=
OPENAI_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=
RATE_LIMIT_REQUESTS=20
RATE_LIMIT_WINDOW_HOURS=1

# Optional: Database
DATABASE_URL=
```

Commit this to Git so team members know what variables are needed.

## Vercel Environment Configuration

### Vercel Dashboard Setup

1. Go to your project → Settings → Environment Variables
2. Add variables for each environment:
   - **Development:** For local testing (not used by Vercel)
   - **Preview:** For pull request deployments
   - **Production:** For main branch deployments

### Development Environment
Used only locally (from `.env.local`):

```
REPLICATE_API_KEY=dev_key_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
RATE_LIMIT_REQUESTS=100
```

### Preview Environment
Used for pull request previews:

```
REPLICATE_API_KEY=preview_key_yyy
NEXT_PUBLIC_APP_URL=https://preview-[hash]-your-domain.vercel.app
RATE_LIMIT_REQUESTS=30
```

### Production Environment
Used for main branch deployments:

```
REPLICATE_API_KEY=prod_key_zzz
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
RATE_LIMIT_REQUESTS=50
```

## Environment Variable Types

### Public Variables (Exposed to Browser)

Prefix with `NEXT_PUBLIC_`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=analytics_key
```

Accessed in browser code:
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

### Private Variables (Node.js Only)

No prefix:

```
REPLICATE_API_KEY=secret_key
DATABASE_PASSWORD=secret_password
```

Only accessible in:
- Server components
- API routes (`src/app/api/`)
- getServerSideProps / getStaticProps

## Accessing Environment Variables in Code

### In API Routes (Node.js)

```typescript
// src/app/api/generate/route.ts
export async function POST(request: NextRequest) {
  const apiKey = process.env.REPLICATE_API_KEY;

  if (!apiKey) {
    throw new Error('REPLICATE_API_KEY not set');
  }

  // Use apiKey...
}
```

### In Server Components

```typescript
// src/app/page.tsx
export default async function Page() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return <div>{appUrl}</div>;
}
```

### In Client Components

Only public variables work:

```typescript
'use client';

export function Component() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  // ✅ Works: NEXT_PUBLIC_APP_URL
  // ❌ Doesn't work: REPLICATE_API_KEY
}
```

### In Next.js Config

```typescript
// next.config.ts
export default {
  env: {
    CUSTOM_VAR: process.env.CUSTOM_VAR,
  },
};
```

## Managing Secrets Securely

### ✅ Do's
- Store all secrets in Vercel Dashboard or `.env.local`
- Use `.env.example` without secrets
- Rotate API keys periodically
- Use different keys for dev/preview/production
- Limit API key scopes (read-only when possible)
- Monitor API usage for suspicious activity

### ❌ Don'ts
- Commit secrets to Git
- Log API keys to console
- Expose API keys in frontend code
- Use production keys in development
- Share secrets via email or Slack
- Leave old keys active

## Getting API Keys

### Replicate

1. Go to [replicate.com](https://replicate.com)
2. Sign up / Log in
3. Navigate to API tab
4. Copy your API token
5. Set as `REPLICATE_API_KEY`

### Stability AI

1. Go to [stabilityai.com](https://stabilityai.com)
2. Sign up / Log in
3. Go to API Keys
4. Create new key
5. Set as `STABILITY_API_KEY`

### OpenAI (DALL-E)

1. Go to [openai.com/api](https://openai.com/api)
2. Sign up / Log in
3. Navigate to API Keys
4. Create new key
5. Set as `OPENAI_API_KEY`

## Variable Naming Conventions

Follow these patterns:

| Type | Pattern | Example |
|------|---------|---------|
| Public | NEXT_PUBLIC_* | NEXT_PUBLIC_APP_URL |
| API Keys | SERVICE_API_KEY | REPLICATE_API_KEY |
| Secrets | SERVICE_SECRET | DATABASE_PASSWORD |
| Features | FEATURE_ENABLED | BATCH_GENERATION_ENABLED |
| Config | SETTING_NAME | RATE_LIMIT_REQUESTS |

## Checking Variables in Vercel

After deploying, verify variables are set:

### Via Vercel Dashboard
1. Project → Deployments → [Your deployment]
2. Check "Environment" tab
3. Confirm all variables are present

### Via Function Logs
1. Project → Logs
2. View function output
3. Add logging to confirm variable access:

```typescript
console.log('API Key available:', !!process.env.REPLICATE_API_KEY);
```

## Troubleshooting

### Variables Not Available in Function

**Problem:** Function can't access environment variables

**Solutions:**
1. Verify variable is set in Vercel Dashboard
2. Redeploy after changing variables
3. Check variable is not prefixed with `NEXT_PUBLIC_` (shouldn't be for secrets)
4. Verify spelling matches exactly (case-sensitive)

### Secrets Exposed in Bundle

**Problem:** Secret appears in browser console or network tab

**Solutions:**
1. Check variable is NOT prefixed with `NEXT_PUBLIC_`
2. Ensure API calls only happen in API routes, not client code
3. Never log secrets to console
4. Use `process.env` only in server-side code

### Different Values in Preview vs Production

**Problem:** Function gets wrong value in preview deployment

**Solutions:**
1. Verify preview environment variables in Vercel Dashboard
2. Check all necessary environments are configured
3. Redeploy preview after changing variables
4. Check that pull request is linked to Vercel project

## Rotating API Keys

### When to Rotate

- Suspected security breach
- Key accidentally committed to Git
- Regularly (e.g., quarterly)
- After employee departure

### How to Rotate

1. **Create new key** in API provider (Replicate, Stability, etc.)
2. **Update Vercel Dashboard** with new key value
3. **Redeploy** to activate new key
4. **Monitor logs** for any errors
5. **Deactivate old key** in API provider

## Database Connections (for v2+)

### Vercel Postgres

```env
DATABASE_URL=postgresql://user:password@db.vercel-storage.com:5432/db_name
```

Use in API routes:

```typescript
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  const result = await sql`SELECT * FROM users`;
  return NextResponse.json(result);
}
```

### Private Environment Variables for Postgres

- `DATABASE_URL` (private)
- `DATABASE_USER` (private)
- `DATABASE_PASSWORD` (private)

Never expose these to frontend.
