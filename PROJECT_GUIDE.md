# Sticker Maker 3D - Project Guide

This guide helps you navigate the project structure and understand how everything is organized.

## Quick Start

### 1. Read the SKILL.md
The **SKILL.md** file is the master document for this project. It contains:
- Complete product vision and requirements
- Technical stack recommendations
- Architecture rules and patterns
- Security, performance, and scalability expectations
- Coding standards and best practices

**Location:** `/SKILL.md`

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit with your API keys
# Add your Replicate, Stability, or OpenAI API keys

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### 3. Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Go to vercel.com
# Import this GitHub repository
# Set environment variables in Vercel Dashboard
# Automatic deployment on push
```

## Project Structure

```
sticker-maker-3d/
├── SKILL.md                    # Master document - READ FIRST
├── PROJECT_GUIDE.md           # This file
├── .env.example               # Environment variables template
├── vercel.json               # Vercel deployment config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
├── next.config.ts            # Next.js config
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts   # ← Vercel Function endpoint
│   │
│   ├── components/            # Reusable React components
│   │   ├── 3d/               # 3D-specific components
│   │   ├── ui/               # UI components
│   │   └── layout/           # Layout components
│   │
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── lib/                  # Library/helper code
│
├── public/                    # Static assets
│   ├── models/               # 3D models
│   └── fonts/                # Custom fonts
│
└── references/               # Documentation
    ├── vercel-setup.md       # Step-by-step Vercel setup
    ├── vercel-functions.md   # Vercel Function patterns
    ├── environment-vars.md   # Environment variable guide
    └── architecture.md       # Deep dive into architecture
```

## Key Files

### For Understanding the Project
- **SKILL.md** - Complete product specification and requirements
- **PROJECT_GUIDE.md** - Navigation and overview (this file)
- **references/architecture.md** - How everything fits together

### For Setting Up
- **.env.example** - Required environment variables
- **vercel.json** - Vercel deployment configuration
- **package.json** - Dependencies and scripts

### For Development
- **src/app/page.tsx** - Main UI entry point
- **src/app/api/generate/route.ts** - Backend API endpoint
- **src/components/** - All React components

## Development Workflow

### Starting Development

```bash
# Start local dev server
npm run dev

# Open http://localhost:3000
# Edit code and see changes instantly (HMR)
```

### Before Deploying

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Test production build locally
npm run start
```

### Deploying to Vercel

```bash
# Push to GitHub
git push origin main

# Vercel automatically deploys
# Check status: https://vercel.com/dashboard

# View logs: Vercel Dashboard → Logs
```

## Environment Variables Setup

### Local Development (.env.local)

1. Copy `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your API keys:
   - Get Replicate API key: https://replicate.com/account/api
   - Get Stability AI key: https://api.stability.ai/
   - Get OpenAI key: https://platform.openai.com/api-keys

3. Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### Production (Vercel Dashboard)

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add the same variables:
   - `REPLICATE_API_KEY` (production key)
   - `STABILITY_API_KEY` (production key)
   - `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`

**Important:** Use different API keys for development and production.

## API Reference

### POST /api/generate

**Request:**
```json
{
  "prompt": "a cute blue robot sticker"
}
```

**Success Response (200):**
```json
{
  "imageUrl": "https://cdn.replicate.com/images/xyz.png",
  "generatedAt": "2024-03-18T12:00:00Z"
}
```

**Error Response (400, 429, 500):**
```json
{
  "error": "Prompt must be 3-256 characters",
  "code": "INVALID_PROMPT"
}
```

## Common Tasks

### Adding a New Component

1. Create file: `src/components/ui/MyComponent.tsx`
2. Export as named export:
   ```typescript
   export function MyComponent({ prop }: Props) {
     return <div>...</div>;
   }
   ```
3. Import and use in page/layout

### Adding Styles

Use Tailwind CSS utility classes:
```typescript
<div className="flex items-center justify-center bg-slate-900 p-4">
  <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded">
    Generate
  </button>
</div>
```

### Accessing Environment Variables

**In API routes (backend):**
```typescript
const apiKey = process.env.REPLICATE_API_KEY;
```

**In client code (frontend):**
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

**Important:** Only `NEXT_PUBLIC_*` variables are accessible in browser code.

### Testing the API Locally

```bash
# Start dev server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a blue robot"}'
```

## Debugging Tips

### Check Function Logs

**Local:**
- Dev server output shows request logs
- Check browser console (F12)

**Production:**
- Vercel Dashboard → [Project] → Logs
- Filter by function name or error

### Check Environment Variables

```typescript
// In API route
console.log('API Key set:', !!process.env.REPLICATE_API_KEY);
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL);
```

### Enable Debug Mode

Add to `.env.local`:
```env
DEBUG=*
```

## Troubleshooting

### "REPLICATE_API_KEY not set"
- ✅ Check `.env.local` has the key
- ✅ Restart dev server after changing `.env.local`
- ✅ Restart app in browser

### Generation times out
- ✅ Check API key is valid
- ✅ Check external service (Replicate, Stability) status
- ✅ Try simpler prompt

### 3D scene not rendering
- ✅ Check browser supports WebGL
- ✅ Check browser console for errors
- ✅ Try different browser

### Deployed to Vercel but API fails
- ✅ Check environment variables in Vercel Dashboard
- ✅ Redeploy after setting variables
- ✅ Check function logs in Vercel Dashboard

## Architecture Overview

See `references/architecture.md` for detailed diagrams and data flows.

**Quick version:**
1. User enters prompt → Frontend
2. Frontend sends to `/api/generate` → Vercel Function
3. Function calls external API (Replicate/Stability)
4. Function returns image URL
5. Frontend loads image and displays in 3D scene

## Next Steps

1. ✅ Read **SKILL.md** completely
2. ✅ Set up `.env.local` with API keys
3. ✅ Run `npm install && npm run dev`
4. ✅ Test locally at `http://localhost:3000`
5. ✅ Push to GitHub
6. ✅ Connect to Vercel and set environment variables
7. ✅ Deploy and test in production

## Resources

- **SKILL.md** - Master specification
- **references/vercel-setup.md** - Detailed Vercel guide
- **references/vercel-functions.md** - Vercel Function patterns
- **references/environment-vars.md** - Environment variable guide
- **references/architecture.md** - System architecture deep dive

## Questions?

Refer to the relevant reference document:
- **Project overview:** SKILL.md
- **Vercel deployment:** references/vercel-setup.md
- **API patterns:** references/vercel-functions.md
- **Environment setup:** references/environment-vars.md
- **How it all fits together:** references/architecture.md
