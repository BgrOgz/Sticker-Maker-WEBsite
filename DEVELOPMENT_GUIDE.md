---
name: Local Development Guide - Premium Sticker Maker v2.0
description: Step-by-step guide to run and test the project locally before deployment
---

# Local Development Guide - Premium Sticker Maker v2.0

## 📋 Overview

This guide walks you through setting up and running the premium sticker maker locally. All code is ready to test — **no pushing to GitHub yet**.

## ✅ What's Already Created

### Documentation
- ✅ **PRODUCT_BLUEPRINT.md** - Full product specification (20+ sections)
- ✅ **RULES.md** - Strict coding standards (must follow!)
- ✅ **DEVELOPMENT_GUIDE.md** - This file

### Implementation Files

#### Type System
- ✅ `src/types/index.ts` - Complete TypeScript definitions

#### Hooks & State Management
- ✅ `src/hooks/useAuth.ts` - Authentication (signup, login, google)
- ✅ `src/hooks/useGeneration.ts` - Generation flow with timer

#### Utilities & Config
- ✅ `src/lib/styles-db.ts` - 10 curated sticker styles
- ✅ `src/lib/falling-images-config.ts` - Falling background configuration

#### Components
- ✅ `src/components/landing/FallingBackground.tsx` - Canvas-based falling image animation
- ✅ **Sticker images extracted** - 10 HEIC files in `public/falling-images/`

#### Environment
- ✅ `.env.example` - Updated with all required variables

### 🚧 Still Needed (Order of Priority)

1. **API Routes** (Backend)
   - `src/app/api/generate/route.ts` - Nano Banana integration
   - `src/app/api/auth/signup/route.ts`
   - `src/app/api/auth/login/route.ts`
   - `src/app/api/auth/google/route.ts`
   - `src/app/api/auth/me/route.ts`

2. **Landing Page Components**
   - `src/components/landing/HeroSection.tsx` - Prompt input + button
   - `src/components/landing/StyleSection.tsx` - Scrollable styles
   - `src/components/landing/StyleCard.tsx` - Individual style card
   - `src/components/landing/AuthModal.tsx` - Sign up / Login form
   - `src/components/landing/PreviewModal.tsx` - 3D preview (post-generation)
   - `src/components/landing/Footer.tsx` - Footer links

3. **UI Components**
   - `src/components/ui/Button.tsx` - Base button
   - `src/components/ui/Input.tsx` - Base input
   - `src/components/ui/Modal.tsx` - Base modal
   - `src/components/ui/Spinner.tsx` - Loading spinner
   - `src/components/ui/Toast.tsx` - Toast notifications

4. **Main Page**
   - `src/app/page.tsx` - Landing page layout (uses all components above)
   - `src/app/globals.css` - Global styles + CSS variables

5. **Testing**
   - Tests for all hooks
   - Component tests
   - Integration tests

## 🚀 Getting Started Locally

### Step 1: Install Dependencies

```bash
cd /Users/bugraoguz/Desktop/Sticker-Maker-WEBsite
npm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

**Required for local testing:**
```env
# Must have (get from respective services):
NEXT_PUBLIC_APP_URL=http://localhost:3000
NANO_BANANA_API_KEY=your_api_key_here

# Auth (generate random values for local):
JWT_SECRET=your_random_secret_min_32_chars
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# These can stay as defaults:
NODE_ENV=development
RATE_LIMIT_REQUESTS_PER_HOUR=30
RATE_LIMIT_ANONYMOUS_PER_HOUR=5
```

**Where to get API keys:**
- **Nano Banana:** https://app.nanobananab.com (sign up, get API key)
- **Google OAuth:** https://console.cloud.google.com (create project, get credentials)

### Step 3: Start Dev Server

```bash
npm run dev
```

Open browser to: **http://localhost:3000**

You should see:
- ✅ Black background with falling sticker images
- ✅ Centered prompt input
- ✅ "Generate" button
- ✅ "Powered by Nano Banana" text

## 🧪 Testing Checklist

### Visual Tests
- [ ] Falling background animates smoothly (60 FPS desktop)
- [ ] Sticker images semi-transparent and rotating
- [ ] No layout shift or jank
- [ ] Responsive on different screen sizes

### Interaction Tests
- [ ] Type in prompt input (shows character count)
- [ ] Click "Generate" button (shows auth modal)
- [ ] Auth modal has two tabs: "Sign Up" / "Login"
- [ ] Scroll down to see style cards
- [ ] Click style card → prompt enriched automatically
- [ ] Scroll back up → prompt field updated

### API Tests (Once Routes Are Created)
```bash
# Test generation endpoint
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a cute blue robot"}'

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Code Standards Reminder

**Before writing any code, review:**
1. Read **RULES.md** (mandatory!)
2. Read **PRODUCT_BLUEPRINT.md** (product spec)

**Key rules that will block commits:**
- ✅ No `any` types (strict TypeScript)
- ✅ All features need tests
- ✅ No `console.log` left in code
- ✅ No unused imports
- ✅ Error handling for all API calls
- ✅ No API keys in code (use env vars only)
- ✅ Comments only for "why", not "what"

**Pre-commit checklist:**
```bash
npm run type-check      # TypeScript ✅
npm run lint            # ESLint ✅
npm test                # Tests ✅
npm run build           # Build ✅
```

## 🛠️ Common Tasks

### Add a New Component

1. **Create file:** `src/components/landing/MyComponent.tsx`
2. **Write component:**
   ```typescript
   interface MyComponentProps {
     // ... props
   }

   export function MyComponent({ ...props }: MyComponentProps): JSX.Element {
     return <div>/* ... */</div>;
   }
   ```
3. **Add tests:** `src/components/landing/__tests__/MyComponent.test.tsx`
4. **Import in page:** `src/app/page.tsx`

### Test a Component Locally

```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm test -- --watch
```

### Check for Secrets Accidentally Committed

```bash
grep -r "NANO_BANANA_API_KEY\|JWT_SECRET\|GOOGLE_" src/ \
  --include="*.ts" --include="*.tsx" \
  | grep -v "process.env"

# Should output: (nothing)
```

### Build for Production

```bash
npm run build

# If successful, start production server:
npm run start
```

## 🐛 Troubleshooting

### "Cannot find module '@/types'"

- Make sure `tsconfig.json` has path alias for `@`:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```

### Falling Background Not Animating

- Check browser console (F12) for errors
- Verify images in `public/falling-images/` directory
- Check that `FallingBackground` component is rendered in layout
- Canvas context issue? Try refreshing page

### API Route Not Responding

- Make sure dev server is running: `npm run dev`
- Check `.env.local` has all required variables
- Restart dev server after changing `.env.local`
- Check terminal output for errors

### TypeScript Errors on Type Imports

- Use `import type { }` for TypeScript types:
  ```typescript
  import type { User, GenerationResponse } from '@/types';
  ```

## 📚 File Reference Quick Link

**To understand the project:**
- `PRODUCT_BLUEPRINT.md` - What we're building
- `RULES.md` - How we write code
- `DEVELOPMENT_GUIDE.md` - This file

**To develop:**
- `src/types/index.ts` - Type definitions
- `src/hooks/` - State management
- `src/lib/` - Utilities and config
- `src/components/` - React components

**To deploy (later):**
- `CLAUDE.md` - Project workspace
- `vercel.json` - Vercel configuration
- `.env.example` - Environment variables

## ✨ Next Steps (After This Setup)

1. ✅ Get Nano Banana API key and add to `.env.local`
2. ✅ Get Google OAuth credentials and add to `.env.local`
3. ✅ Run `npm install` and `npm run dev`
4. ✅ Test falling background animation at http://localhost:3000
5. Create API routes (`/api/generate`, `/api/auth/*`)
6. Create landing page components
7. Test end-to-end flow locally
8. Run full test suite: `npm test`
9. Build for production: `npm run build`
10. Push to GitHub when ready

## 🎯 Success Criteria (Local Testing)

- ✅ Dev server runs without errors
- ✅ Falling background renders at 60 FPS
- ✅ No console errors or warnings
- ✅ TypeScript: `npm run type-check` passes
- ✅ Linting: `npm run lint` passes
- ✅ No secrets in code
- ✅ Responsive layout (mobile, tablet, desktop)

## 📞 Questions?

- **Product spec?** → Read `PRODUCT_BLUEPRINT.md`
- **Code standards?** → Read `RULES.md`
- **Architecture?** → Read `references/architecture.md`
- **Deployment?** → Read `references/vercel-setup.md`

---

**Ready to start?** Run:
```bash
npm install && npm run dev
```

Visit: http://localhost:3000 ✨
