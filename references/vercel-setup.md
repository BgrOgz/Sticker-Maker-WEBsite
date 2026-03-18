# Vercel Setup Guide

## Step 1: Create Vercel Account & Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your GitHub repositories
4. Click "New Project"
5. Select `Sticker-Maker-WEBsite` repository
6. Click "Import"

## Step 2: Configure Environment Variables

In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables:

### Development Environment
```
REPLICATE_API_KEY=your_replicate_api_key
STABILITY_API_KEY=your_stability_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
RATE_LIMIT_REQUESTS=20
```

### Preview Environment
```
REPLICATE_API_KEY=your_preview_key
NEXT_PUBLIC_APP_URL=https://preview-your-domain.vercel.app
RATE_LIMIT_REQUESTS=30
```

### Production Environment
```
REPLICATE_API_KEY=your_production_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
RATE_LIMIT_REQUESTS=50
```

## Step 3: Configure Domains

1. Go to Settings → Domains
2. Add your custom domain (or use default `.vercel.app` domain)
3. Configure DNS settings if using custom domain

## Step 4: Deploy

1. Vercel auto-deploys on every push to `main` branch
2. Preview deployments created for every pull request
3. Check deployment status in Deployments tab

## Step 5: Monitor Logs

1. Go to your project → Logs
2. Select Function to view Vercel Function logs
3. Filter by error level to find issues

## Local Development with .env.local

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
REPLICATE_API_KEY=your_test_key
STABILITY_API_KEY=your_test_key
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_HOURS=1
```

Run `npm run dev` to start development server with these variables.

## Vercel Project Settings

Key settings to configure:

### Build Settings
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Function Settings
- **Memory:** 1024 MB (1 GB) for `/api/generate` endpoint
- **Max Duration:** 60 seconds
- **Regions:** `iad1` (US East - adjust for your region)

### Git Settings
- **Production Branch:** `main`
- **Enable Preview Deployments:** On
- **Automatic Deployments:** On

## Troubleshooting

### Build Fails
- Check build logs: Deployments → [Failed deployment] → Build logs
- Common issues:
  - Missing dependencies: Run `npm install` locally and commit lock file
  - TypeScript errors: Fix type issues locally with `npm run type-check`
  - Environment variables: Verify all required vars are set

### Function Timeout
- Increase `maxDuration` in `src/app/api/generate/route.ts`
- Check if external API is slow (add logging)

### Cold Start Issues
- Minimize function dependencies
- Lazy-load heavy libraries
- Check function size: should be < 50 MB

### Environment Variables Not Loading
- Verify variables are set in Vercel Dashboard
- Restart deployment after changing variables
- Check that variable names exactly match code (case-sensitive)
