# Sticker Maker 3D - Project Workspace

**Project Type:** Production-grade 3D web application with AI image generation
**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, React Three Fiber
**Deployment:** Vercel Apps (Serverless Functions)
**Status:** Blueprint phase (ready for implementation)

## Project Overview

A modern web application where users enter text prompts to generate custom stickers using AI, with interactive 3D preview and rotation capabilities. The experience should feel premium, futuristic, and visually impressive.

**Key Features:**
- Text-based prompt input for sticker generation
- AI image generation via backend Vercel Function
- Interactive 3D scene with React Three Fiber
- Rotation, zoom, and inspection capabilities
- Download and regenerate functionality
- Premium dark theme with neon accents

## Master Documentation

- **SKILL.md** - Complete product specification, architecture, and implementation guide
- **PROJECT_GUIDE.md** - Quick start and navigation
- **RULES.md** - Coding standards and project guidelines (READ FIRST)
- **references/** - Detailed technical guides (Vercel, architecture, env vars)

## Quick Start

```bash
# 1. Read project rules (non-negotiable)
cat RULES.md

# 2. Read full specification
cat SKILL.md

# 3. Set up environment
cp .env.example .env.local
# Edit with your API keys

# 4. Install and develop
npm install
npm run dev

# 5. Deploy to Vercel
git push origin main
```

## Key Files & Directories

```
sticker-maker-3d/
├── CLAUDE.md          ← You are here
├── RULES.md           ← Coding standards (must read)
├── SKILL.md           ← Full specification
├── PROJECT_GUIDE.md   ← Navigation guide
├── vercel.json        ← Deployment config
├── .env.example       ← Environment template
│
├── src/app/
│   ├── page.tsx                    # Main UI
│   ├── globals.css                 # Global styles
│   └── api/generate/route.ts       # Vercel Function (API)
│
├── src/components/
│   ├── 3d/                         # 3D scene components
│   ├── ui/                         # UI components
│   └── layout/                     # Layout components
│
├── src/hooks/                      # Custom React hooks
├── src/types/                      # TypeScript definitions
├── src/utils/                      # Utility functions
│
└── references/                     # Technical documentation
    ├── architecture.md             # System design
    ├── vercel-setup.md            # Vercel guide
    ├── vercel-functions.md        # Function patterns
    └── environment-vars.md        # Env var guide
```

## Code Quality Standards

**All code must follow RULES.md standards:**

### Non-Negotiable Rules
- ✅ **No commits without tests** - Every feature needs test coverage
- ✅ **No `any` types** - Use proper TypeScript typing
- ✅ **No leftover console.log** - Clean logs before committing
- ✅ **No loose dependencies** - All imports must be used
- ✅ **Type-safe code** - `strict: true` in tsconfig
- ✅ **Error handling** - No silent failures
- ✅ **Security first** - No secrets in code, no API keys in frontend

See **RULES.md** for complete details.

## Architecture at a Glance

### Frontend (React + Three.js)
```
User Input → Validation → API Call (/api/generate)
                              ↓
                        Loading State
                              ↓
                    Receive Image URL
                              ↓
                   Load & Render in 3D
                              ↓
                   Interactive Preview
```

### Backend (Vercel Function)
```
POST /api/generate
    ↓
Validate Prompt
    ↓
Check Rate Limit
    ↓
Call Replicate/Stability/OpenAI
    ↓
Poll for Result (60s timeout)
    ↓
Return Image URL
```

## Development Workflow

### 1. Before Starting
- Read **RULES.md** (coding standards)
- Read **SKILL.md** (product spec and technical design)
- Check **PROJECT_GUIDE.md** for quick reference

### 2. Development
```bash
npm run dev              # Start dev server
npm run type-check      # TypeScript check
npm run lint            # ESLint check
```

### 3. Before Committing
Follow **RULES.md** checklist:
- [ ] All tests pass
- [ ] No `any` types (strict TypeScript)
- [ ] No console.log, debugger statements
- [ ] All imports used
- [ ] Error handling complete
- [ ] No secrets in code
- [ ] Code is documented (comments where needed)

### 4. Testing
```bash
npm test                # Run tests
npm run type-check      # Type check
npm run lint            # Lint check
npm run build           # Build check
```

### 5. Deploying
```bash
# Push to main triggers Vercel auto-deploy
git push origin main

# Check deployment: https://vercel.com/dashboard
# View logs: Vercel Dashboard → Logs
```

## Environment Setup

### Local Development (.env.local)
```env
REPLICATE_API_KEY=your_key
STABILITY_API_KEY=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
RATE_LIMIT_REQUESTS=100
```

### Vercel Dashboard
Set separate variables for Preview and Production:
- Different API keys (dev vs production)
- Different rate limits
- Different URLs

See **references/environment-vars.md** for details.

## Key Decision Points

### 1. AI Image Generation Service
- **Recommended:** Replicate (easiest API, good models)
- **Alternative:** Stability AI (SDXL, faster)
- **Alternative:** OpenAI DALL-E (most expensive)

### 2. 3D Library
- **Selected:** React Three Fiber + Three.js
- **Rationale:** Best for interactive 3D, great React integration

### 3. State Management
- **Selected:** Zustand or Context API
- **Rationale:** Lightweight, no overkill for this scope

### 4. Styling
- **Selected:** Tailwind CSS
- **Rationale:** Utility-first, rapid development, dark theme support

### 5. Deployment
- **Selected:** Vercel Apps (Serverless Functions)
- **Rationale:** Native Next.js support, automatic scaling, easy env vars

## API Specification

### Generate Sticker Endpoint

**Endpoint:** `POST /api/generate`

**Request:**
```json
{
  "prompt": "a blue sticker of a cute robot"
}
```

**Success (200):**
```json
{
  "imageUrl": "https://cdn.replicate.com/images/xyz.png",
  "generatedAt": "2024-03-18T12:00:00Z"
}
```

**Error (400/429/500):**
```json
{
  "error": "User-friendly error message",
  "code": "ERROR_CODE"
}
```

**Validation Rules:**
- Prompt: 3-256 characters
- Rate limit: 20 requests/IP/hour
- Timeout: 60 seconds max

## Performance Targets

| Metric | Target | Note |
|--------|--------|------|
| Initial Load | < 3s | First paint |
| API Response | < 30s | Including external API |
| 3D Rendering | 60 FPS | Smooth interaction |
| Bundle Size | < 300 KB | Gzipped |
| Function Cold Start | < 5s | Vercel optimization |

## Security Checklist

- [ ] No API keys in frontend code
- [ ] No secrets in `.env.local` committed
- [ ] Input validation (frontend & backend)
- [ ] Rate limiting enabled
- [ ] Error messages don't expose internals
- [ ] CORS properly configured
- [ ] HTTPS only in production
- [ ] Secrets in Vercel Dashboard, not code

## Testing Strategy

### Unit Tests
- Utility functions
- Input validation
- State management

### Integration Tests
- API endpoint behavior
- Error handling
- Rate limiting

### E2E Tests (Optional, v2+)
- Full flow: input → generation → display
- Error scenarios
- Different browsers

**Tool Recommendation:** Jest + React Testing Library

## Code Organization

### Component Structure
```typescript
// One component per file
// Single responsibility principle
// Typed props with interfaces

interface ComponentProps {
  // ...
}

export function Component({ ...props }: ComponentProps) {
  // Component logic
}
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `StickerCanvas.tsx`)
- Utils: `camelCase.ts` (e.g., `api.ts`)
- Types: `PascalCase.ts` in `types/` folder
- Hooks: `useCamelCase.ts` (e.g., `useGeneration.ts`)

### Import Organization
```typescript
// 1. External libraries
import React from 'react';
import { Canvas } from '@react-three/fiber';

// 2. Internal components
import { StickerModel } from '@/components/3d';

// 3. Hooks
import { useGeneration } from '@/hooks';

// 4. Types
import type { StickerState } from '@/types';

// 5. Utils
import { validatePrompt } from '@/utils';
```

## Git Workflow

### Branch Naming
```
feature/component-name       # New feature
fix/bug-description          # Bug fix
refactor/area-name          # Refactoring
docs/topic-name             # Documentation
```

### Commit Messages
```
feat: add 3D sticker rotation control
fix: handle API timeout in generation
refactor: simplify state management
docs: update architecture guide
test: add prompt validation tests
```

### Before Pushing
```bash
npm run type-check    # TypeScript check
npm run lint          # ESLint check
npm test              # Run tests
npm run build         # Production build
git push origin main
```

## Troubleshooting Guide

### "REPLICATE_API_KEY not set"
1. Check `.env.local` exists and has the key
2. Restart dev server (Ctrl+C, npm run dev)
3. Restart browser

### "Generation timeout"
1. Check external service status
2. Try simpler prompt
3. Check Vercel function logs

### "TypeScript errors"
1. Run `npm run type-check` to see all errors
2. Fix type issues (no `any` allowed)
3. Check that all imports are correct

### "Function doesn't work in production"
1. Check environment variables in Vercel Dashboard
2. Redeploy after changing env vars
3. Check function logs in Vercel Dashboard

See **PROJECT_GUIDE.md** for more troubleshooting.

## Future Phases

### Phase 2 (Optional)
- User accounts (Vercel Auth)
- Generation history
- Gallery view
- Customization options (style, colors)

### Phase 3 (Optional)
- Export options (SVG, PDF)
- Editing tools
- Social features
- Mobile app

## Resources

**Must Read:**
1. **RULES.md** - Coding standards (read first!)
2. **SKILL.md** - Complete specification

**Reference:**
- **PROJECT_GUIDE.md** - Quick start
- **references/architecture.md** - System design
- **references/vercel-setup.md** - Vercel guide
- **references/vercel-functions.md** - API patterns
- **references/environment-vars.md** - Env vars

**External:**
- [Next.js Docs](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vercel Docs](https://vercel.com/docs)

## Project Statistics

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Components** | React 19 with Hooks |
| **Styling** | Tailwind CSS 4 |
| **3D** | React Three Fiber + Three.js |
| **Backend** | Vercel Functions (Node.js) |
| **Deployment** | Vercel (auto on git push) |
| **Package Manager** | npm/pnpm |
| **Testing** | Jest + React Testing Library |
| **Linting** | ESLint + Prettier |

## Success Criteria

Project is production-ready when:
- ✅ All tests pass
- ✅ No TypeScript errors
- ✅ No console.log or debugger statements
- ✅ All security rules followed
- ✅ Performance targets met
- ✅ Deployed to Vercel successfully
- ✅ Error handling complete
- ✅ Documentation complete

## Questions?

1. **"What should I build first?"** → Read SKILL.md, start with frontend layout
2. **"What are the coding rules?"** → Read RULES.md (mandatory)
3. **"How do I deploy?"** → See references/vercel-setup.md
4. **"What's the architecture?"** → See references/architecture.md
5. **"How do environment variables work?"** → See references/environment-vars.md

---

**Last Updated:** 2024-03-18
**Project Phase:** Blueprint → Ready for Implementation
**Status:** Complete specification and documentation ready for development
