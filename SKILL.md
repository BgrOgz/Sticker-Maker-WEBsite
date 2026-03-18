---
name: sticker-generator-3d-vercel
description: Build a production-grade 3D sticker generator web application deployed on Vercel Apps. Users input text prompts to generate custom stickers via AI, with interactive 3D preview and rotation. Use this skill whenever creating a 3D web experience, AI-powered generation tools, Vercel serverless deployments, or premium interactive design systems. The result should feel modern, futuristic, and production-ready with proper state management, error handling, and Vercel-optimized scalability.
compatibility: Node.js 18+, Vercel Functions/Apps, modern browsers with WebGL support
---

# 3D Sticker Generator Web Application (Vercel Apps)

## Project Objective

Build a modern, production-grade web application deployed on Vercel Apps that enables users to generate custom stickers by entering text prompts. The application processes prompts through an AI image generator (Vercel Function), displays results in an interactive 3D environment, and allows users to inspect stickers from multiple angles. The experience should feel premium, futuristic, and performant with serverless architecture.

## Product Vision

**Core Experience:**
- User enters a text prompt describing a sticker design
- Vercel Function generates a 2D sticker image via AI image generation API
- Generated sticker appears in a 3D scene, floating in virtual space
- User can rotate, zoom, and inspect the sticker from all angles
- User can download the result or regenerate with a new prompt

**Design Philosophy:**
- Minimal, clean interface that doesn't distract from the 3D experience
- Premium aesthetic with careful typography, spacing, and animation
- Futuristic without being cluttered; modern without being trendy
- Responsive across desktop and tablet (mobile as secondary concern)
- Performance prioritized: instant feedback, smooth interactions, no jank

## Functional Requirements

### User-Facing Features
1. **Prompt Input**
   - Text input field with character limit (256 characters)
   - Submit button or keyboard shortcut (Enter to generate)
   - Clear/reset button to start fresh

2. **Sticker Generation**
   - Call to Vercel Function `/api/generate` endpoint
   - Display loading state while generation is in progress
   - Show generation time to the user (builds confidence)
   - Ability to regenerate from same prompt
   - Cancel generation in progress

3. **3D Preview & Interaction**
   - Display generated image as a 3D quad/plane in virtual space
   - Mouse/touch controls for rotation (drag to rotate)
   - Pinch-to-zoom on touch devices
   - Auto-rotate option (continuous slow rotation)
   - Reset view button (center and reset zoom/rotation)
   - Switch between different 3D presentation modes (flat card, rounded billboard, etc.)

4. **History & Management**
   - Display previously generated stickers in a scrollable gallery (optional, for v2)
   - Download generated sticker as PNG/SVG
   - Copy generation prompt for sharing or regeneration
   - Delete from history (local storage only, no accounts)

5. **Error & Edge Cases**
   - Handle API failures gracefully with user-friendly messages
   - Warn if prompt is too short or too long
   - Provide retry mechanism for failed generations
   - Handle browser compatibility (WebGL detection)
   - Handle network timeouts

### System Features (Vercel Functions)
1. **Backend API Endpoint**
   - POST `/api/generate` Vercel Function accepts prompt, returns image data
   - Rate limiting per IP (20 requests/hour for demo, configurable)
   - Timeout handling (max 60s generation time)
   - Error responses with descriptive messages
   - Cold start optimization for serverless

2. **Security**
   - API keys stored in Vercel environment variables only
   - No API keys exposed in frontend code, network requests, or localStorage
   - Input validation on both frontend and backend
   - CORS properly configured
   - Sanitize prompts to prevent injection

3. **Performance**
   - Initial page load under 3 seconds (including 3D scene setup)
   - Image generation response under 30 seconds
   - Smooth 60 FPS 3D interactions
   - Lazy-load 3D library code if possible
   - Optimize bundled code size

## UI/UX Expectations

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  [Header] Sticker Maker 3D                  │
├─────────────────────────────────────────────┤
│  [Left Sidebar]     [3D Canvas Area]        │
│  • Prompt Input     • Interactive 3D View   │
│  • Controls         • Loading spinner       │
│  • Gallery (opt)    • Error message area    │
│                     • Download button       │
└─────────────────────────────────────────────┘
```

### Visual Design
- **Color Palette:** Dark theme (dark gray/charcoal background) with neon accent colors (bright cyan, magenta, or electric blue)
- **Typography:** Modern sans-serif (Inter, SF Pro Display, or similar). Large headlines, readable body text
- **Animations:** Smooth fade-ins, scale transitions, subtle hover effects. No rapid or jarring animations
- **3D Canvas:** Dark gradient background, clean lighting, sticker floats in center with subtle shadow
- **Buttons:** Minimal design, text-only or icon + text, clear hover states
- **Spacing:** Generous whitespace, proper visual hierarchy

### State Visualization

**Empty State (Initial Load)**
- Show animated placeholder in 3D canvas
- Prompt input is ready and focused (optional)
- Display hint text: "Enter a description to generate a sticker"

**Loading State (Generation in Progress)**
- Replace 3D canvas with animated loading spinner
- Show generation time counter (elapsed seconds)
- Disable input and generation button
- Show "Cancel" button instead of "Generate"

**Success State (Sticker Generated)**
- Display sticker in 3D canvas with smooth entrance animation
- Show download button, regenerate button
- Re-enable input for new generation
- Optionally show generation time and model used

**Error State (Generation Failed)**
- Show error message in a dismissible alert/banner
- Provide "Retry" or "Try Different Prompt" action
- Keep previous sticker visible if available
- Log error to console for debugging (not shown to user)

## Technical Stack Recommendations

### Frontend
- **Framework:** Next.js 15+ (App Router, server components)
- **UI Framework:** React 19+
- **Styling:** Tailwind CSS 4+ with custom config for dark theme and premium feel
- **3D Graphics:** React Three Fiber (R3F) + Three.js
- **Animation:** Framer Motion for UI animations, Three.js for 3D animations
- **Language:** TypeScript (strict mode)
- **State Management:** React Context API or Zustand (lightweight)
- **HTTP Client:** fetch (native, no external dependency) or axios
- **Build Tool:** Next.js built-in Webpack configuration

### Backend (Vercel Functions)
- **Runtime:** Node.js 18+ with Vercel Functions (no framework overhead needed)
- **Language:** TypeScript
- **Image Generation:** Call to Replicate, Stability AI, OpenAI DALL-E, or similar
- **Rate Limiting:** Custom middleware in Vercel Function
- **Validation:** Zod or similar
- **Deployment:** Vercel (automatic from Git)

### DevOps & Deployment
- **Hosting:** Vercel (native Next.js + Vercel Functions support)
- **Environment Variables:** Vercel Dashboard (production) + `.env.local` (development)
- **Package Manager:** npm or pnpm
- **Git Workflow:** Feature branches, pull requests, conventional commits
- **Database:** Optional PostgreSQL via Vercel Postgres (for v2+)

## Folder Structure

```
sticker-maker-3d/
├── .claude/
│   └── plugins/
│       └── sticker-generator-3d-skill/
│           ├── SKILL.md              # This file
│           ├── references/
│           │   ├── vercel-setup.md   # Vercel configuration guide
│           │   ├── vercel-functions.md
│           │   ├── environment-vars.md
│           │   └── architecture.md
│           └── assets/
│               ├── vercel.json.template
│               └── example.env.local
├── public/
│   ├── models/              # 3D models, textures (if needed)
│   └── fonts/               # Custom fonts
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts # Vercel Function endpoint
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── StickerCanvas.tsx      # Three.js/R3F canvas
│   │   │   ├── StickerScene.tsx       # Scene setup
│   │   │   ├── StickerModel.tsx       # 3D sticker model
│   │   │   └── Lights.tsx             # Lighting setup
│   │   ├── ui/
│   │   │   ├── PromptInput.tsx        # Input form
│   │   │   ├── GenerateButton.tsx     # Submit button
│   │   │   ├── LoadingSpinner.tsx     # Loading indicator
│   │   │   ├── ErrorAlert.tsx         # Error message
│   │   │   ├── DownloadButton.tsx     # Download action
│   │   │   └── Controls.tsx           # 3D view controls
│   │   └── layout/
│   │       ├── Header.tsx             # Top header
│   │       └── Sidebar.tsx            # Left sidebar
│   ├── hooks/
│   │   ├── useGeneration.ts           # Generation state logic
│   │   ├── useStickerState.ts         # Sticker data management
│   │   └── useThreeJSSetup.ts         # 3D scene initialization
│   ├── types/
│   │   └── index.ts                   # TypeScript types
│   ├── utils/
│   │   ├── api.ts                     # API client functions
│   │   ├── validation.ts              # Input validation
│   │   └── 3d.ts                      # 3D utility functions
│   └── lib/
│       └── constants.ts               # App constants
├── .env.local                         # Local environment (git-ignored)
├── .env.example                       # Environment variables template
├── vercel.json                        # Vercel deployment config
├── next.config.ts                     # Next.js config
├── tailwind.config.ts                 # Tailwind config
├── tsconfig.json                      # TypeScript config
└── package.json
```

## Architecture Rules

### Frontend Architecture
1. **Component Hierarchy**
   - Keep components small and focused (single responsibility)
   - Lift state up only when necessary; use Context for global state
   - Use custom hooks for complex logic (generation, 3D setup)

2. **State Management**
   - Local component state for UI (input value, open/closed modals)
   - Context/Zustand for:
     - Current sticker image (URL, metadata)
     - Generation status (loading, success, error)
     - 3D scene state (rotation, zoom)
   - Never store API keys or sensitive data in state that could be logged

3. **API Communication**
   - All API calls routed through `/api/generate` (Vercel Function)
   - Never call external image generation APIs directly from frontend
   - Handle timeouts (max 30 seconds per request)
   - Implement retry logic with exponential backoff for transient failures

4. **3D Scene Management**
   - Initialize Three.js scene once on mount
   - Dispose of scene properly on unmount (cleanup resources)
   - Separate concerns: scene setup, lighting, model, camera, controls
   - Use React Three Fiber for declarative 3D components

### Backend Architecture (Vercel Functions)

**Function Structure:**
```typescript
// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  maxDuration: 60, // 60 second timeout
  regions: ['iad1'], // Deploy in specific region for lower latency
};

export async function POST(request: NextRequest) {
  // 1. Validate request
  // 2. Rate limit check
  // 3. Call external API
  // 4. Handle errors
  // 5. Return response

  return NextResponse.json({ imageUrl: string });
}
```

**Key Principles:**
1. **Stateless:** Each function invocation is independent
2. **Quick Cold Start:** Minimize dependencies, lazy-load heavy libraries
3. **Timeout Aware:** Set realistic timeouts, handle gracefully
4. **Error Boundaries:** Never expose internal stack traces to client
5. **Rate Limiting:** Implement per-IP limits to prevent abuse

### Security Layer (Vercel Function)
- Validate prompt: non-empty, <256 chars, no injection patterns
- Rate limit by IP (not user agent — easier to spoof)
- Don't expose internal error details to client
- Log suspicious requests (extremely long prompts, rapid requests)
- Use environment variables for all secrets

### Image Generation Integration
- Call external API (Replicate, Stability, OpenAI) from Vercel Function only
- Store API keys in Vercel environment variables
- Implement timeouts for external API calls (30 seconds)
- Cache generated images briefly (optional, for identical prompts within 1 hour)

## Backend and Frontend Responsibilities

### Frontend Responsibilities
- ✅ Accept user input (prompt text)
- ✅ Validate input locally (length, format)
- ✅ Send request to `/api/generate` endpoint
- ✅ Display loading state while awaiting response
- ✅ Render 3D scene and generated sticker
- ✅ Handle user interactions (rotation, zoom, reset)
- ✅ Display errors to user in friendly format
- ✅ Provide download/export functionality
- ✅ Manage UI state and animations

### Backend (Vercel Function) Responsibilities
- ✅ Validate incoming prompt
- ✅ Rate limit by IP (check headers, implement counter in memory or Redis)
- ✅ Call external image generation API securely
- ✅ Handle API timeouts and failures
- ✅ Return image data (URL or base64) to frontend
- ✅ Log requests and errors (to stdout, visible in Vercel logs)
- ✅ Return appropriate HTTP status codes
- ✅ Handle cold starts gracefully

## AI Image Generation Flow

### Request Flow
```
User Input
    ↓
Frontend Validation (prompt length, format)
    ↓
Show Loading State
    ↓
POST to /api/generate { prompt }
    ↓
[Vercel Function] Validate prompt
    ↓
[Vercel Function] Check rate limit
    ↓
[Vercel Function] Call image generation API (Replicate, Stability, etc.)
    ↓
[Vercel Function] Wait for image (up to 60s timeout)
    ↓
[Vercel Function] Return image URL or base64
    ↓
Frontend receives response
    ↓
Load image asset
    ↓
Render in 3D scene with entrance animation
    ↓
Hide loading state, show success state
```

### Handling External API (Replicate Example)

```typescript
// Example: Calling Replicate from Vercel Function
async function generateStickerImage(prompt: string): Promise<string> {
  const apiKey = process.env.REPLICATE_API_KEY;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: process.env.REPLICATE_MODEL_VERSION,
      input: { prompt },
    }),
  });

  const prediction = await response.json();

  // Poll for completion (with timeout)
  const startTime = Date.now();
  const maxWaitTime = 55000; // 55 seconds (5s buffer for cleanup)

  while (prediction.status === 'processing') {
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error('Generation timeout');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    const polledResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: { 'Authorization': `Token ${apiKey}` },
      }
    );
    Object.assign(prediction, await polledResponse.json());
  }

  if (prediction.status === 'failed') {
    throw new Error('Generation failed: ' + prediction.error);
  }

  return prediction.output[0]; // image URL
}
```

## Security Rules

### Secrets Management (Vercel)
- **NEVER** commit API keys to version control
- Store secrets in Vercel Dashboard → Settings → Environment Variables
- Example variables: `REPLICATE_API_KEY`, `STABILITY_API_KEY`
- Use `.env.example` to document required variables without secrets
- Different secrets for preview/production deployments

### Input Validation
- Validate prompt on frontend (UX) and backend (security)
- Reject prompts with:
  - Length < 3 or > 256 characters
  - SQL injection patterns (quotes, semicolons in unusual context)
  - Command injection patterns (backticks, pipes)
- Use Zod or similar for structured validation

### API Security
- Validate Content-Type: only accept `application/json`
- Validate prompt field exists and is a string
- Return 400 for invalid requests, not 500
- Rate limit: max 20 requests per IP per hour (configurable)
- Log rate limit violations (potential abuse)

### Frontend Security
- Don't log API keys or sensitive data to console (even in development)
- Sanitize error messages before displaying to user
- Use HTTPS only (Vercel enforces this automatically)
- Set appropriate CORS headers

### Data Privacy
- Don't store user-generated prompts in a database (privacy concern)
- Don't store generated images beyond session (unless user explicitly saves)
- Clear sensitive data from memory when done
- If implementing accounts, use secure password hashing (bcrypt, argon2)

## Vercel Apps Specific Configuration

### Environment Variables Setup
Create these variables in Vercel Dashboard:

**Development (`.env.local`)**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
REPLICATE_API_KEY=your_key_here
STABILITY_API_KEY=your_key_here
RATE_LIMIT_REQUESTS=20
RATE_LIMIT_WINDOW_HOURS=1
```

**Production (Vercel Dashboard)**
- `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
- `REPLICATE_API_KEY=prod_key_here`
- `STABILITY_API_KEY=prod_key_here`
- `RATE_LIMIT_REQUESTS=50` (higher for production)
- `RATE_LIMIT_WINDOW_HOURS=1`

### vercel.json Configuration

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "env": {
    "REPLICATE_API_KEY": "@replicate_api_key",
    "STABILITY_API_KEY": "@stability_api_key"
  },
  "redirects": [],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### Deployment Workflow

1. **Connect GitHub Repository**
   - Push code to GitHub
   - Connect repo to Vercel project

2. **Preview Deployments**
   - Every push to non-main branch triggers preview deployment
   - Get preview URL to test changes
   - Merge PR to deploy to production

3. **Environment Variables**
   - Set in Vercel Dashboard
   - Different vars for dev/preview/production
   - Restart deployment after changing vars

4. **Monitoring Deployment**
   - Check Vercel Dashboard for build status
   - View function logs in Vercel Dashboard
   - Monitor errors via Sentry integration

## Performance Rules

### Frontend Performance
- **Page Load:** Initial load under 3 seconds
  - Use Next.js code splitting for 3D libraries
  - Lazy load Three.js and Framer Motion
  - Optimize images in public/ folder
  - Use next/image for responsive images

- **3D Rendering:** Maintain 60 FPS
  - Use requestAnimationFrame, not setInterval
  - Minimize draw calls
  - Use efficient geometries (don't create unnecessary vertices)
  - Dispose of unused textures and geometries

- **Bundle Size:** Keep main bundle under 300 KB gzipped
  - Tree-shake unused libraries
  - Use dynamic imports for heavy dependencies
  - Monitor bundle size with `next/bundle-analyzer`

### Backend Performance (Vercel Functions)
- **API Response Time:** < 5 seconds for validation, < 30 seconds for generation
- **Timeout Handling:** Set 60-second timeout on external API calls
- **Cold Start Optimization:**
  - Minimize dependencies in route handler
  - Lazy-load heavy libraries (image processing, ML models)
  - Use `maxDuration: 60` in function config
  - Avoid database connections in generation function

- **Memory Management:** Set `memory: 1024` (1GB) in vercel.json for generate function
- **Regions:** Deploy in `iad1` (US East) for lower latency, or adjust based on user location

### Network Optimization
- Compress images (WebP with PNG fallback)
- Use Vercel CDN for static assets (automatic)
- Implement caching headers for static assets (1 week)
- Don't cache API responses (always generate fresh)

## Scalability Expectations

### Handling Growth (Vercel Functions Auto-Scaling)
- **Small Scale (1-100 requests/day):** Current architecture handles easily
- **Medium Scale (1,000+ requests/day):** Vercel auto-scales, add image caching (1 hour)
- **Large Scale (10,000+ requests/day):** Consider:
  - Implement job queue via Vercel Cron for background processing
  - Use Vercel KV (Redis) for rate limiting and caching
  - Separate image generation into dedicated function with higher memory
  - Implement image optimization pipeline

### Database Considerations (for v2+)
- Use Vercel Postgres for persistent data:
  - Generation history (prompt, image URL, timestamp)
  - User accounts and preferences
  - Analytics (popular prompts, generation success rate)

### Infrastructure
- **Current:** Vercel Functions (serverless, auto-scaling)
- **Growth Path:** Add Vercel Postgres, Vercel KV, Cron jobs as needed
- **Monitoring:** Set up error tracking (Sentry), analytics (Vercel Analytics)

## Coding Standards

### TypeScript
- Enable strict mode: `"strict": true` in tsconfig.json
- Always type React components: `React.FC<Props>` or `function Component(props: Props)`
- Type all function parameters and return types
- Use interfaces for component props, types for data models
- Avoid `any` — use `unknown` if necessary, then narrow with type guards

### Vercel Function Best Practices
```typescript
// ✅ Good: Quick, efficient handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Validate and process

    return NextResponse.json({ imageUrl: string });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}

// ❌ Bad: Blocking, slow
export default async function handler(req: any, res: any) {
  // Heavy initialization
  // Long-running operations
  // Unhandled errors
}
```

### React Components
```typescript
// ✅ Good: Named export, typed props
interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [input, setInput] = useState('');
  return (/* ... */);
}

// ❌ Bad: Default export, untyped, inline arrow function
export default (props) => { /* ... */ }
```

### File Naming
- Components: PascalCase (e.g., `StickerCanvas.tsx`)
- Utilities: camelCase (e.g., `api.ts`, `validation.ts`)
- Types: PascalCase, suffix with `.ts` (e.g., `types.ts`)

### Code Organization
- One component per file (unless very tightly coupled)
- Co-locate styles with components (inline Tailwind)
- Keep files under 300 lines
- Separate concerns: UI logic, business logic, API communication

### Styling with Tailwind
- Use utility classes, avoid arbitrary CSS when possible
- Respect the color palette (dark theme, accent colors)
- Use semantic spacing (p-4, gap-6, etc.)
- Apply responsive classes thoughtfully (mb-4 md:mb-6)

## Error Handling Expectations

### User-Facing Errors
- **Network Error:** "Unable to connect. Please check your internet and try again."
- **Generation Timeout:** "Sticker generation took too long. Please try a simpler prompt."
- **Invalid Prompt:** "Prompt must be between 3 and 256 characters."
- **Rate Limited:** "Too many requests. Please wait a moment and try again."
- **Server Error:** "Something went wrong. Please try again later or contact support."

### Developer-Facing Errors (Vercel Logs)
- Log with context: timestamp, request ID, stack trace
- Use structured logging:
  ```typescript
  console.log(JSON.stringify({
    level: 'error',
    message: 'Generation failed',
    error: error.message,
    context: { prompt_length, service: 'replicate' },
    timestamp: new Date().toISOString(),
  }));
  ```
- Never log API keys or sensitive user data
- Check logs in Vercel Dashboard → Logs tab

### Error Recovery
- Provide "Retry" button for transient errors (network, timeout)
- Suggest "Try Different Prompt" for generation failures
- Allow user to modify and resubmit if validation fails
- Never silently fail — always show user feedback

### Testing Error States
- Test with invalid prompts (empty, too long, special characters)
- Test with network failures (use network throttling tools)
- Test with slow generation (add artificial delays)
- Test Vercel Function behavior under rate limiting

## Future Expansion Planning

### Phase 2 Features
- **User Accounts:** Sign-up, login, saved stickers history (use Vercel Auth)
- **Gallery:** Browse previously generated stickers, share with others
- **Customization:** Adjust style (cartoon, realistic, etc.), colors, size
- **Batch Generation:** Generate multiple variations of same prompt
- **Model Selection:** Choose between different AI models (Flux, SDXL, etc.)

### Phase 3 Features
- **Export Options:** Download as PNG, SVG (vectorize), PDF
- **Editing Tools:** Crop, rotate, adjust colors post-generation
- **Social Features:** Share stickers, view community gallery, comments/likes
- **Mobile App:** React Native version with offline caching

### Infrastructure Improvements
- **Vercel Postgres:** User accounts, generation history
- **Vercel KV:** Rate limiting, caching
- **Vercel Cron:** Background job processing for bulk generations
- **Image Optimization:** Automatic image compression pipeline
- **Analytics:** Usage tracking, popular prompts dashboard
- **Error Tracking:** Sentry integration for production monitoring

### Monitoring & Observability
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Usage analytics (generation count, popular prompts)
- Health checks for external APIs
- Uptime monitoring

## Development Workflow

### Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest sticker-maker-3d --typescript

# Install dependencies
npm install react-three-fiber three framer-motion zustand zod

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Development Commands
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
npm test             # Run tests (set up Jest)
```

### Deployment to Vercel
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys from main branch
# Check progress in Vercel Dashboard
# View function logs: Vercel Dashboard → [Project] → Logs
```

### Environment Setup for Vercel
1. **Vercel Dashboard → Settings → Environment Variables**
   - Add `REPLICATE_API_KEY`, `STABILITY_API_KEY`, etc.
   - Select which environments (Development, Preview, Production)

2. **Test Environment**
   - Preview deployments use preview environment variables
   - Production deployments use production environment variables

3. **Verify Deployment**
   - Check build logs for errors
   - Test API endpoint: `curl https://your-domain.vercel.app/api/generate -X POST`

## Success Criteria

The project is production-ready when:
- ✅ User can input prompt and generate sticker in < 5 seconds (plus external API time)
- ✅ 3D preview renders smoothly at 60 FPS with no visible artifacts
- ✅ All error states are handled gracefully with clear user messaging
- ✅ Loading state provides feedback (spinner, elapsed time)
- ✅ API keys are never exposed (verified via code review and network inspection)
- ✅ Vercel Function logs show no errors or warnings
- ✅ Mobile responsiveness tested on tablets (mobile optional for v1)
- ✅ Accessibility: keyboard navigation works, contrast ratios meet WCAG AA
- ✅ Performance: page load < 3 seconds, bundle < 300 KB gzipped
- ✅ Rate limiting prevents abuse (20 req/IP/hour)
- ✅ Code is well-typed, documented, and maintainable
- ✅ Deployment to Vercel works without manual steps
- ✅ Environment variables correctly configured for preview/production

---

## Reference Guides

See bundled reference files for more details:
- `references/vercel-setup.md` — Step-by-step Vercel configuration
- `references/vercel-functions.md` — Vercel Function best practices
- `references/environment-vars.md` — Environment variable management
- `references/architecture.md` — Detailed architecture patterns
