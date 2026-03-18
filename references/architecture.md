# Architecture Deep Dive

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React 19 / Next.js 15 Frontend                        │  │
│  │  • Tailwind CSS + Framer Motion (UI)                   │  │
│  │  • React Three Fiber + Three.js (3D)                   │  │
│  │  • Zustand / Context (State Management)                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/JSON
                           ↓
┌─────────────────────────────────────────────────────────────┐
│           Vercel Edge Network / Serverless                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js API Route: POST /api/generate                │  │
│  │  • Request validation (Zod)                           │  │
│  │  • Rate limiting (in-memory / Vercel KV)              │  │
│  │  • External API orchestration                         │  │
│  │  • Error handling & logging                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        External AI Image Generation Service                  │
│  • Replicate API                                            │
│  • Stability AI                                             │
│  • OpenAI DALL-E                                            │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Tree

```
<App>
  <Header />
  <main className="flex">
    <Sidebar>
      <PromptInput />
      <Controls />
      <History /> {/* v2+ */}
    </Sidebar>
    <Canvas>
      <StickerCanvas>
        <StickerScene>
          <StickerModel />
          <Lights />
          <Camera />
          <Controls />
        </StickerScene>
      </StickerCanvas>
      <Overlay>
        <LoadingSpinner /> {/* conditional */}
        <ErrorAlert /> {/* conditional */}
        <DownloadButton />
      </Overlay>
    </Canvas>
  </main>
</App>
```

### State Flow

```
┌─────────────────────────────────┐
│    Global State (Zustand)       │
├─────────────────────────────────┤
│ • currentSticker                │
│ • generationStatus              │
│ • error                         │
│ • 3dSceneState                  │
└─────────────────────────────────┘
         ↑          ↓
         │          │
    ┌────┴──────────┴────┐
    │                    │
Components          Hooks
    │                    │
    └────────┬───────────┘
             │
          Actions
    • generate()
    • resetSticker()
    • updateSceneState()
```

### Data Flow: Generation Request

```
1. User types prompt
   └─> PromptInput state updates

2. User clicks "Generate"
   └─> useGeneration hook triggered
       └─> Validation (length, format)
           └─> setStatus('loading')

3. POST /api/generate { prompt }
   └─> Vercel Function handles
       └─> External API call
           └─> Response with imageUrl

4. Frontend receives imageUrl
   └─> setStatus('success')
       └─> Load image asset
           └─> Render in 3D scene

5. Animation triggers
   └─> StickerModel displays
       └─> User can interact
```

## Backend Architecture (Vercel Functions)

### Function Layers

```
POST /api/generate
│
├─ Layer 1: Input Validation
│  └─ Check: prompt exists, is string, 3-256 chars
│
├─ Layer 2: Rate Limiting
│  └─ Check: IP hasn't exceeded rate limit
│
├─ Layer 3: External API Call
│  ├─ Call: Replicate/Stability/OpenAI API
│  └─ Poll: Wait for result (max 55s)
│
├─ Layer 4: Response Processing
│  └─ Extract: Image URL from API response
│
├─ Layer 5: Error Handling
│  └─ Format: Consistent error response
│
└─ Layer 6: Return
   └─ JSON response to client
```

### Request Lifecycle

```
1. NextRequest arrives
   └─ Headers: { 'content-type': 'application/json', ... }
   └─ Body: { "prompt": "a cat" }

2. Validate
   └─ Check content type
   └─ Parse JSON
   └─ Validate prompt

3. Rate Limit
   └─ Get IP from x-forwarded-for header
   └─ Check request count
   └─ Increment counter

4. External API
   └─ Construct request to Replicate
   └─ Send with API key (from env var)
   └─ Get prediction ID

5. Poll for Result
   └─ Wait 1s, check status
   └─ Repeat until done or timeout
   └─ Extract image URL

6. Return Success
   └─ { imageUrl: "...", generatedAt: "..." }
   └─ Status 200

7. Error Handling (any step)
   └─ Catch error
   └─ Log with context
   └─ Return { error: "...", code: "..." }
   └─ Status 400/429/500
```

## Data Models

### StrickerState (Frontend)

```typescript
interface StickerState {
  // Current sticker
  imageUrl: string | null;
  prompt: string;
  generatedAt: string;

  // Generation status
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  generationTime: number; // ms

  // 3D scene
  rotation: { x: number; y: number };
  zoom: number;
  autoRotate: boolean;
}
```

### GenerateRequest (API)

```typescript
interface GenerateRequest {
  prompt: string; // 3-256 characters
}
```

### GenerateResponse (API)

```typescript
interface GenerateResponse {
  imageUrl: string; // URL to generated image
  generatedAt: string; // ISO timestamp
  seed?: number; // Optional: seed used
}

// Error response
interface ErrorResponse {
  error: string; // User-friendly error message
  code: string; // Error code (INVALID_PROMPT, RATE_LIMITED, etc.)
}
```

### RateLimitStore

```typescript
interface RateLimitEntry {
  ip: string;
  timestamps: number[]; // Request timestamps
  count: number; // Current count in window
}
```

## Data Flow: Complete Example

```
USER ACTION
│
├─ Enters prompt: "a blue sticker of a robot"
├─ Clicks "Generate"
│
└─> FRONTEND
    ├─ Validate: length = 27 ✓, characters ✓
    ├─ Update state: status = 'loading'
    ├─ Show spinner
    │
    └─> HTTP POST /api/generate
        Body: { "prompt": "a blue sticker of a robot" }
        │
        └─> VERCEL FUNCTION
            ├─ Receive request
            ├─ Get IP: "203.0.113.45"
            ├─ Validate prompt: length ✓, format ✓
            ├─ Check rate limit: count = 3/20 ✓
            │
            ├─> Call Replicate API
            │   ├─ POST /v1/predictions
            │   ├─ version: "xyz:abc"
            │   ├─ input: { "prompt": "a blue sticker of a robot" }
            │   └─ Get prediction ID: "pred-123"
            │
            ├─> Poll for completion
            │   ├─ GET /v1/predictions/pred-123
            │   ├─ Status: "processing" (retry)
            │   ├─ GET /v1/predictions/pred-123
            │   ├─ Status: "succeeded" (done)
            │   └─ output: ["https://cdn.replicate.com/images/xyz.png"]
            │
            ├─ Return response
            │   ├─ Status: 200
            │   └─ Body: {
            │        "imageUrl": "https://cdn.replicate.com/images/xyz.png",
            │        "generatedAt": "2024-03-18T12:00:00Z"
            │      }
            │
            └─> HTTP 200 Response
                │
                └─> FRONTEND
                    ├─ Receive response
                    ├─ Extract imageUrl
                    ├─ Load image (preload in memory)
                    ├─ Update state:
                    │  ├─ status = 'success'
                    │  ├─ imageUrl = "https://..."
                    │  ├─ generatedAt = "..."
                    │  └─ generationTime = 4523ms
                    │
                    ├─ Hide spinner
                    ├─ Render image in 3D
                    │  ├─ Create texture from image
                    │  ├─ Create plane mesh
                    │  ├─ Add to scene
                    │  └─ Animate entrance (fade + scale)
                    │
                    ├─ Enable interaction
                    │  ├─ Mouse controls
                    │  ├─ Download button
                    │  └─ Regenerate button
                    │
                    └─ Show success state
                        ├─ Display image info
                        ├─ Show download option
                        └─ Ready for next generation

USER SEES
├─ Generated sticker in 3D
├─ Can rotate/zoom
├─ Can download
└─ Can enter new prompt
```

## Error Handling Flow

```
Error occurs at any step
│
├─> VALIDATION ERROR (400)
│   ├─ Prompt too short/long
│   ├─ Invalid characters
│   └─ Return: { error: "...", code: "INVALID_PROMPT" }
│
├─> RATE LIMITED (429)
│   ├─ Too many requests
│   └─ Return: { error: "...", code: "RATE_LIMITED" }
│
├─> TIMEOUT (504)
│   ├─ External API too slow
│   └─ Return: { error: "...", code: "TIMEOUT" }
│
├─> EXTERNAL API ERROR (500)
│   ├─ Replicate/Stability returns error
│   └─ Return: { error: "...", code: "GENERATION_FAILED" }
│
└─> UNKNOWN ERROR (500)
    ├─ Unexpected error
    ├─ Log with full context
    └─ Return: { error: "...", code: "SERVER_ERROR" }

FRONTEND
├─ Receives error
├─ Clears loading state
├─ Shows error message
├─ Provides retry button
└─ User can retry
```

## Performance Optimization Patterns

### Code Splitting

```typescript
// Load 3D libraries only when needed
const StickerCanvas = dynamic(
  () => import('@/components/3d/StickerCanvas'),
  {
    ssr: false, // Don't render on server
    loading: () => <div>Loading 3D...</div>,
  }
);
```

### Image Lazy Loading

```typescript
<Image
  src={imageUrl}
  alt="Generated sticker"
  width={512}
  height={512}
  priority={false} // Lazy load
  quality={80} // Optimize quality
/>
```

### Memoization

```typescript
const StickerModel = React.memo(({ imageUrl }: Props) => {
  // Only re-render if imageUrl changes
  return </*...*/>;
});
```

## Scaling Considerations

### Current (Small Scale)
- Single Vercel Function
- In-memory rate limiting
- Single deployment region
- No caching

### Growth Path (Medium Scale)
- Add Vercel KV for persistent rate limiting
- Implement image caching (1-hour TTL)
- Monitor function cold starts
- Consider separate function for batch generation

### Large Scale
- Multiple functions per region
- Database for rate limiting + history
- Image optimization pipeline
- CDN for generated images
- Job queue for background processing
