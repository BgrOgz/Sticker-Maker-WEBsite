---
name: Premium Sticker Maker - Product Blueprint
description: Implementation-ready blueprint for premium AI sticker generator with falling background, auth flow, and style system
version: 2.0
updated: 2026-03-18
---

# Premium Sticker Maker - Product Blueprint v2.0

## Executive Summary

**Evolution:** From 3D-focused sticker inspector to premium conversion-focused landing platform.

A luxury black-themed AI sticker generation platform powered by Nano Banana API. Users arrive at a visually stunning landing page, see premium falling image background, and are immediately encouraged to generate stickers. The product prioritizes conversions, premium aesthetics, and frictionless user experience.

---

## Product Vision

### Aesthetic Direction
**Style:** Luxury Tech + Futurism + Minimalism

- **Dominant Aesthetic:** Refined luxury tech (Apple-meets-Vercel energy)
- **Color Palette:** Deep black (#0a0a0a) + Pure white (#ffffff) + Premium accent (cyan #00d9ff or magenta #ff00ff)
- **Typography:** Distinctive sans-serif (Space Mono or custom) for display + precise body fonts
- **Motion:** Smooth, intentional, elegant. Nothing jarring. Premium micro-interactions.
- **Atmosphere:** Immersive falling images create "digital rain" effect. Premium. Hypnotic. Memorable.

### What Makes This UNFORGETTABLE

1. **Falling Image Background** - Unique, premium, hypnotic. Not generic.
   - Uses actual generated sticker images falling like digital rain
   - Smooth, elegant animation
   - Creates immersive, full-screen experience
   - Every user sees a different background (their creations or popular stickers)

2. **Frictionless Auth** - Gate features without killing conversion
   - Auth modal only appears when clicking Generate
   - Modern, lightweight signup flow
   - Social login (Google) as primary CTA
   - Email secondary option

3. **Smart Style Enhancement** - Not just visual filters
   - Scrolling reveals curated styles (cyberpunk, anime, realistic, etc.)
   - Clicking a style ENRICHES the prompt field with descriptive tags
   - Example: Select "Cyberpunk" → prompt field auto-adds "cyberpunk neon holographic glitch art style"
   - This helps users generate BETTER stickers faster

---

## Core User Journey

### Landing Page (Unauthenticated)
```
Arrives at URL
    ↓
Sees: Premium black page + falling images background + centered prompt input
    ↓
Reads: "Generate custom stickers with AI" (one-liner value prop)
    ↓
Option A: Types prompt → Clicks Generate → Auth modal appears
    ↓
Option B: Scrolls down → Sees style cards → Clicks style → Prompt enriched → Scrolls back up
    ↓
Creates account / Google sign-in
    ↓
Generation starts
    ↓
Image appears in 3D preview (premium smooth entrance)
    ↓
Can download, regenerate, or generate new
```

### Post-Auth (Authenticated User)
```
Returns to landing (or direct URL)
    ↓
No auth modal - instant generation
    ↓
Prompt input + Generate button ready
    ↓
Can scroll to see styles anytime
    ↓
Generation history saved (optional, v2)
    ↓
Can share generation results
```

---

## Page Hierarchy & Structure

### Page 1: Landing Page (/)
**Hero Section**
- Full viewport height
- Black background with falling images
- Centered prompt input + generate button
- One-line value proposition
- "Powered by Nano Banana" text (subtle)

**Styles Section** (on scroll)
- Scrollable horizontal or vertical style cards
- Each card shows: style name, example, description
- Clickable → enriches prompt
- ~10-15 pre-defined styles

**Footer Section**
- Links (privacy, terms, contact)
- Social icons
- Status indicator (API online/offline)

### Page 2: Gallery (Optional, v2)
- User's generated stickers
- Sharable links
- Download history

---

## Component Architecture

```
Landing Page (/)
├── Background (Falling Images Animation)
├── HeroSection
│   ├── PromptInput
│   ├── GenerateButton
│   ├── ValueProposition
│   └── AuthGuard (renders auth modal if needed)
├── StyleSection (scrollable)
│   ├── StyleCard[] (map over styles)
│   │   ├── StyleImage
│   │   ├── StyleName
│   │   └── StyleDescription
│   └── PromptEnhancer (handles click logic)
├── PreviewModal (appears after generation)
│   ├── 3DCanvas (React Three Fiber)
│   ├── DownloadButton
│   ├── RegenerateButton
│   ├── NewGenerationButton
│   └── ShareButton
├── AuthModal (appears on generate if unauthenticated)
│   ├── SignUpForm
│   ├── LoginForm
│   ├── GoogleOAuthButton
│   ├── EmailFormToggle
│   └── CloseButton (can dismiss & come back later)
└── Footer
    ├── Links
    ├── SocialIcons
    └── StatusIndicator
```

---

## Design System

### Colors (CSS Variables)
```css
--color-bg-primary: #0a0a0a;      /* Deep black */
--color-bg-secondary: #1a1a1a;    /* Slightly lighter black */
--color-text-primary: #ffffff;    /* Pure white */
--color-text-secondary: #b0b0b0;  /* Muted gray */
--color-accent: #00d9ff;          /* Cyan */
--color-accent-alt: #ff00ff;      /* Magenta (hover states) */
--color-border: #2a2a2a;          /* Subtle dividers */
--color-success: #00ff88;         /* Success state */
--color-error: #ff3366;           /* Error state */
--color-loading: #00d9ff;         /* Loading animation color */
```

### Typography
**Display Font:** Space Mono (monospace, technical, distinctive)
- Headlines (h1, h2, h3)
- Logo/branding

**Body Font:** -apple-system, BlinkMacSystemFont, Segoe UI (precise, clean)
- Body text
- Input fields
- Buttons

### Spacing System
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 32px
- **xl:** 64px
- **2xl:** 128px

### Responsive Breakpoints
- **Mobile:** 320px - 639px
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px+

---

## Feature Specifications

### 1. Falling Image Background

**Technical Implementation:**
- Canvas-based animation for performance
- RequestAnimationFrame loop
- ~10-30 images falling simultaneously
- Images are small (50px - 150px), semi-transparent (opacity: 0.3-0.6)
- Smooth, continuous downward motion
- Wrap around: images loop from top to bottom
- No performance impact on prompt input

**Animation Details:**
```javascript
// Pseudo-code
images = loadUserStickerImages() // or popular stickers
canvas = createFullscreenCanvas()

animationLoop():
  // For each falling image
  image.y += imageSpeed (2-8px per frame)
  if image.y > viewport.height:
    image.y = -image.height
    image.x = random(0, viewport.width)

  drawImage(image, opacity=0.3-0.6)
```

**Performance Targets:**
- 60 FPS on desktop
- 30 FPS acceptable on mobile
- <10MB memory usage
- No layout shift

### 2. Prompt Input & Generation

**Input Specifications:**
- Single-line input or textarea
- Placeholder: "Describe your sticker... e.g., 'cute blue robot'"
- Min length: 3 characters
- Max length: 256 characters
- Character counter visible (optional)
- Submit on Enter key OR button click

**Generate Button:**
- Text: "Generate ✨" or "Create Sticker"
- Always visible (hero section)
- On click (unauthenticated): Show auth modal
- On click (authenticated): Start generation
- Loading state: Spinner + "Generating..." + elapsed time counter

**Loading State:**
- Disable input during generation
- Show cancellable generation (with X button)
- Display elapsed time (1s, 2s, 3s, etc.)
- Estimated time hint: "Usually 15-30 seconds"

### 3. Style System & Prompt Enhancement

**Available Styles (Curated):**
1. **Cyberpunk** → "cyberpunk neon holographic glitch art style, bright colors, tech"
2. **Anime** → "anime character design, expressive eyes, clean lines, vibrant colors"
3. **Realistic** → "photorealistic, detailed, professional photography, 4k"
4. **Watercolor** → "watercolor painting style, soft edges, artistic, colorful"
5. **Pixel Art** → "pixel art, 8-bit, retro video game style, blocky"
6. **3D Render** → "3D render, octane render, professional lighting, detailed"
7. **Comic** → "comic book style, bold outlines, halftone shading, dramatic"
8. **Minimalist** → "minimalist design, simple shapes, limited color palette, flat"
9. **Surreal** → "surreal art, dreamlike, surrealism, fantastical elements"
10. **Neon** → "neon sign aesthetic, glowing, dark background, vibrant"

**Interaction Flow:**
```
User types: "a robot"
    ↓
Scrolls down
    ↓
Sees style cards
    ↓
Clicks "Cyberpunk" card
    ↓
Prompt automatically enriches to: "a robot cyberpunk neon holographic glitch art style, bright colors, tech"
    ↓
Scrolls back up
    ↓
Prompt ready to submit
```

**Implementation:**
- Click handler on style card
- Append style descriptor to input value (with space separator)
- Smooth scroll back to hero
- Auto-focus input
- Optional: Show toast "Style applied ✨"

### 4. Authentication Flow

**Gate Mechanism:**
- Users can see homepage and styles WITHOUT login
- Clicking Generate button:
  - Check if authenticated
  - If NOT: Show auth modal
  - If YES: Start generation

**Auth Modal Design:**
- Center-screen overlay
- White text on dark semi-transparent background
- Two tabs: "Sign Up" / "Already have an account?"

**Sign Up Tab:**
```
┌─────────────────────────────┐
│  Create Your Account        │
├─────────────────────────────┤
│                             │
│ [Google OAuth Button]       │
│  Continue with Google       │
│                             │
│ ─────── or ───────         │
│                             │
│ Email:  [input]            │
│ Password: [input]          │
│ [Sign Up Button]           │
│                             │
│ Already have account?       │
│ [Switch to Login]          │
│                             │
└─────────────────────────────┘
```

**Login Tab:**
```
┌─────────────────────────────┐
│  Welcome Back              │
├─────────────────────────────┤
│                             │
│ [Google OAuth Button]       │
│  Continue with Google       │
│                             │
│ ─────── or ───────         │
│                             │
│ Email:  [input]            │
│ Password: [input]          │
│ [Login Button]             │
│                             │
│ Don't have account?         │
│ [Switch to Sign Up]        │
│                             │
└─────────────────────────────┘
```

**Authentication Methods:**
1. **Google OAuth** (Primary)
   - Click redirects to Google sign-in
   - Return to app with token
   - Auto-create account if first time

2. **Email/Password** (Secondary)
   - Sign up: email + password
   - Login: email + password
   - Backend validates and creates session

**Post-Auth:**
- Modal closes
- Generation starts automatically (same prompt)
- User sees loading state

### 5. 3D Preview (Post-Generation)

**When Image Arrives:**
1. Modal/fullscreen container appears
2. React Three Fiber scene initializes
3. Image appears as 3D plane
4. Auto-rotate (slow, gentle)
5. User can:
   - Click/drag to rotate
   - Scroll to zoom
   - Button to reset view
   - Toggle auto-rotate

**UI Overlay on 3D:**
```
[X Close]

    [3D Canvas Area]

[Download] [↻ Regenerate] [+ New]
```

---

## API Specifications

### POST /api/generate

**Request:**
```json
{
  "prompt": "a cute blue robot cyberpunk style",
  "style": "cyberpunk" // optional, for tracking
}
```

**Success (200):**
```json
{
  "imageUrl": "https://cdn.example.com/generated/xyz.png",
  "generatedAt": "2026-03-18T15:30:00Z",
  "generationTime": 18,
  "model": "flux-pro"
}
```

**Error (400/429/500):**
```json
{
  "error": "Prompt must be 3-256 characters",
  "code": "INVALID_PROMPT",
  "retryAfter": 60
}
```

**Validation Rules:**
- Prompt: 3-256 characters
- Rate limit: 30 req/user/hour (authenticated), 5 req/IP/hour (anonymous)
- Timeout: 60 seconds max
- Nano Banana integration for generation

### POST /api/auth/signup

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Success (201):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "token": "jwt_token_xyz"
}
```

### POST /api/auth/google

**Request:**
```json
{
  "googleToken": "id_token_from_google"
}
```

**Success (200/201):**
```json
{
  "id": "user_123",
  "email": "user@google.com",
  "isNewUser": false,
  "token": "jwt_token_xyz"
}
```

### GET /api/auth/me

**Authenticated Request** (with Bearer token)

**Success (200):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "createdAt": "2026-03-18T10:00:00Z"
}
```

**Unauthorized (401):**
```json
{
  "error": "Unauthorized"
}
```

---

## Frontend Stack

### Core
- **Framework:** Next.js 15+ (App Router)
- **UI:** React 19+
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4+
- **Animation:** Framer Motion (UI) + CSS (background)
- **3D:** React Three Fiber + Three.js
- **State:** Zustand (lightweight, <1KB)
- **HTTP:** fetch API (native)

### Auth
- **Frontend:** NextAuth.js v5 or custom JWT
- **Google OAuth:** @react-oauth/google
- **Session Storage:** HttpOnly cookies (secure)

### Dev Tools
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode
- **Bundler:** Next.js webpack (built-in)

---

## Backend Stack

### Vercel Functions
- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes
- **Language:** TypeScript

### External Services
- **Image Generation:** Nano Banana API
- **Authentication:** Custom JWT + Google OAuth
- **Database:** Vercel Postgres (optional, v2+)
- **Storage:** Vercel Blob or CDN

### Integrations
- **Email:** SendGrid or Resend (for password reset)
- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   ├── globals.css               # Global styles
│   └── api/
│       ├── auth/
│       │   ├── signup/route.ts
│       │   ├── login/route.ts
│       │   ├── google/route.ts
│       │   ├── me/route.ts
│       │   └── logout/route.ts
│       └── generate/route.ts      # Nano Banana integration
│
├── components/
│   ├── landing/
│   │   ├── FallingBackground.tsx  # Canvas animation
│   │   ├── HeroSection.tsx        # Prompt input area
│   │   ├── StyleSection.tsx       # Scrollable styles
│   │   ├── StyleCard.tsx
│   │   ├── AuthModal.tsx          # Sign up / Login modal
│   │   ├── PreviewModal.tsx       # Post-generation 3D view
│   │   └── Footer.tsx
│   ├── 3d/
│   │   ├── Canvas.tsx             # React Three Fiber container
│   │   ├── Scene.tsx              # Scene setup
│   │   ├── StickerPlane.tsx       # 3D plane showing image
│   │   └── Lights.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Spinner.tsx
│       ├── Toast.tsx
│       └── StatusBar.tsx
│
├── hooks/
│   ├── useGeneration.ts           # Generation state
│   ├── useAuth.ts                 # Auth context hook
│   ├── useStyles.ts               # Style management
│   ├── useFallingImages.ts        # Background animation
│   └── useDevice.ts               # Responsive detection
│
├── context/
│   ├── AuthContext.tsx            # Global auth state
│   └── GenerationContext.tsx      # Generation state
│
├── types/
│   ├── index.ts                   # All type definitions
│   ├── api.ts                     # API types
│   ├── auth.ts                    # Auth types
│   └── generation.ts              # Generation types
│
├── utils/
│   ├── api-client.ts             # Fetch wrapper
│   ├── auth.ts                    # Auth helpers
│   ├── validation.ts              # Input validation
│   ├── storage.ts                 # LocalStorage helpers
│   ├── prompt-enhancement.ts      # Style appending logic
│   └── nano-banana.ts             # Nano Banana integration
│
├── lib/
│   ├── constants.ts               # App constants
│   ├── styles-db.ts               # Curated styles
│   └── config.ts                  # App configuration
│
└── styles/
    ├── variables.css              # CSS custom properties
    ├── animations.css             # Reusable animations
    └── theme.css                  # Theme overrides
```

---

## State Management

### Global State (Zustand)
```typescript
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  // Generation
  currentPrompt: string;
  generatedImageUrl: string | null;
  isGenerating: boolean;
  generationError: string | null;
  generationTime: number;

  // UI
  isAuthModalOpen: boolean;
  isPreviewModalOpen: boolean;
  selectedStyle: Style | null;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  setPrompt: (prompt: string) => void;
  applyStyle: (style: Style) => void;
  // ... etc
}
```

### Local Component State
- Input field values
- Form validation states
- Modal open/close
- 3D camera rotation/zoom

---

## Authentication Flow (Detailed)

### Sign-Up with Email
```
1. User sees auth modal
2. Clicks "Sign Up" tab
3. Enters email + password
4. Validates frontend (email format, password strength)
5. POST /api/auth/signup { email, password }
6. Backend:
   - Validate input
   - Hash password (bcrypt)
   - Check if email exists
   - Create user record
   - Generate JWT token
7. Frontend receives token
8. Store token in HttpOnly cookie
9. Set Zustand user state
10. Close modal, start generation
```

### Login with Email
```
1. User sees auth modal
2. Clicks "Already have account?" → Login tab
3. Enters email + password
4. POST /api/auth/login { email, password }
5. Backend:
   - Validate credentials
   - Compare password hash
   - Generate JWT token
6. Same as signup from step 7
```

### Sign-Up with Google
```
1. User clicks "Continue with Google"
2. Google OAuth flow in @react-oauth/google
3. Receives googleToken (ID token)
4. POST /api/auth/google { googleToken }
5. Backend:
   - Validate googleToken with Google API
   - Extract email, name, picture
   - Check if user exists
   - If NOT: Create new user
   - If YES: Return existing user
   - Generate JWT token
6. Frontend stores token + user
7. Same as email signup from step 8
```

### Session Management
- **Storage:** HttpOnly cookies (server sets, client can't access)
- **JWT:** Stored in cookie, validated on each request
- **Expiry:** 30 days (configurable)
- **Refresh:** Auto-refresh on page load

---

## Performance Targets

| Metric | Target |
|--------|--------|
| **Initial Load** | < 3 seconds (FCP) |
| **Falling Animation** | 60 FPS (desktop), 30 FPS (mobile) |
| **Generation Time** | 15-45 seconds (external API) |
| **API Response** | < 500ms (validation) |
| **Modal Open** | < 200ms |
| **3D Scene Load** | < 1 second |
| **Bundle Size** | < 350 KB (gzipped) |
| **3D FPS** | 60 FPS smooth rotation |

---

## Security Checklist

- ✅ All API keys in env vars (never in code)
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens in HttpOnly cookies (not localStorage)
- ✅ CORS properly configured (allow own domain only)
- ✅ Rate limiting per user (authenticated) and IP (anonymous)
- ✅ Input validation on both frontend and backend
- ✅ No sensitive data in error messages (log to Sentry)
- ✅ Prompt sanitization (no SQL injection, XSS)
- ✅ HTTPS enforced (Vercel default)
- ✅ OAuth tokens validated with provider

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
- Validation functions
- Utility functions
- Custom hooks (useAuth, useGeneration)
- Individual components

### Integration Tests
- Auth flow (signup, login, logout)
- Generation flow (prompt → API → display)
- Style enhancement logic

### E2E Tests (Optional, v2+)
- Full user journey: landing → auth → generate → view
- Multiple browsers

### Test Coverage Target: 70%+

---

## Deployment

### Development
```bash
npm install
cp .env.example .env.local
# Edit .env.local with dev API keys
npm run dev
# Visit http://localhost:3000
```

### Production (Vercel)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# Set env vars in Vercel Dashboard:
# - NANO_BANANA_API_KEY
# - JWT_SECRET
# - DATABASE_URL (if using Postgres)
# - GOOGLE_OAUTH_ID
# - GOOGLE_OAUTH_SECRET
```

---

## Success Criteria

- ✅ Falling image background renders at 60 FPS
- ✅ Prompt input always accessible
- ✅ Auth modal appears on generate (unauthenticated)
- ✅ Google OAuth works end-to-end
- ✅ Email auth fully functional
- ✅ Style cards scroll and enhance prompt correctly
- ✅ Generation completes in <60 seconds
- ✅ 3D preview loads and rotates smoothly
- ✅ Download button works
- ✅ No API keys exposed
- ✅ No console errors
- ✅ Mobile responsive (320px+)
- ✅ All tests pass
- ✅ TypeScript strict: no errors
- ✅ ESLint passes
- ✅ Deploys to Vercel without errors

---

## Future Phases (v2+)

### Phase 2
- Generation history (saved per user)
- Gallery view
- Share sticker links
- Batch generation (5 at once)
- Model selection (Flux vs SDXL)

### Phase 3
- Export formats (PNG, SVG, PDF)
- Editing tools (crop, adjust colors)
- Social features (comments, likes)
- Mobile app (React Native)

---

## References

- **RULES.md** - Coding standards
- **CLAUDE.md** - Project workspace
- **SKILL.md** - Original 3D spec (reference for 3D implementation)
- **references/architecture.md** - Technical deep dive
- **references/environment-vars.md** - Env var management
- **references/vercel-setup.md** - Vercel deployment

