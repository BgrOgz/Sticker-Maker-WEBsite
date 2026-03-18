# Vercel Functions Best Practices

## Function Structure

Vercel Functions are serverless functions that handle API requests. They're defined in `src/app/api/` directory.

### Basic Function

```typescript
// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  maxDuration: 60, // 60 second timeout
  regions: ['iad1'], // Deploy in specific region
};

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request
    const body = await request.json();
    const { prompt } = body;

    // 2. Validate
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    if (prompt.length < 3 || prompt.length > 256) {
      return NextResponse.json(
        { error: 'Prompt must be 3-256 characters' },
        { status: 400 }
      );
    }

    // 3. Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // 4. Call external service
    const imageUrl = await generateImage(prompt);

    // 5. Return response
    return NextResponse.json({
      imageUrl,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Generation error:', error);

    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
```

## Key Configuration Options

### maxDuration
Maximum execution time in seconds:
- Default: 10 seconds
- Production: 10-60 seconds (depending on plan)
- Set based on external API timeout

```typescript
export const config = {
  maxDuration: 60,
};
```

### regions
Deploy function to specific regions for lower latency:

```typescript
export const config = {
  regions: ['iad1'], // US East (default)
  // Other options: sfo1, lhr1, syd1, etc.
};
```

### runtime
Specify Node.js version:

```typescript
export const config = {
  runtime: 'nodejs18.x',
};
```

## Accessing Environment Variables

Use `process.env` to access Vercel environment variables:

```typescript
const apiKey = process.env.REPLICATE_API_KEY;

if (!apiKey) {
  throw new Error('REPLICATE_API_KEY not set');
}
```

**Important:** Environment variables set in Vercel Dashboard are automatically available in functions.

## Handling Requests

### Get Request Method

```typescript
export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ message: 'ok' });
}
```

### Post with Validation

```typescript
export async function POST(request: NextRequest) {
  // Check Content-Type
  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 400 }
    );
  }

  const body = await request.json();
  // Process body...
}
```

### Accessing Request Headers

```typescript
const authorization = request.headers.get('authorization');
const userAgent = request.headers.get('user-agent');
const ip = request.headers.get('x-forwarded-for');
```

## Returning Responses

### JSON Response

```typescript
return NextResponse.json({ data: value });
```

### Error Response

```typescript
return NextResponse.json(
  { error: 'Error message' },
  { status: 400 }
);
```

### Custom Headers

```typescript
const response = NextResponse.json({ data: value });
response.headers.set('Cache-Control', 'no-cache');
return response;
```

## External API Integration

### Example: Replicate API

```typescript
async function generateImage(prompt: string): Promise<string> {
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

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.status}`);
  }

  const prediction = await response.json();

  // Poll for completion
  const imageUrl = await pollForCompletion(prediction.id);
  return imageUrl;
}

async function pollForCompletion(predictionId: string): Promise<string> {
  const apiKey = process.env.REPLICATE_API_KEY;
  const maxWaitTime = 55000; // 55 seconds (5s buffer)
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: { 'Authorization': `Token ${apiKey}` },
      }
    );

    const prediction = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction.output[0];
    }

    if (prediction.status === 'failed') {
      throw new Error('Prediction failed: ' + prediction.error);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Prediction timeout');
}
```

## Rate Limiting

### In-Memory Rate Limiter (Simple)

```typescript
// utils/rateLimiter.ts
const requests: Map<string, number[]> = new Map();

export function isRateLimited(ip: string, limit = 20, windowMs = 3600000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!requests.has(ip)) {
    requests.set(ip, [now]);
    return false;
  }

  const timestamps = requests.get(ip)!;
  const recentRequests = timestamps.filter(t => t > windowStart);

  if (recentRequests.length >= limit) {
    return true;
  }

  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return false;
}
```

Use in function:

```typescript
if (isRateLimited(ip)) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

## Error Handling Best Practices

### Don't Expose Internal Errors

```typescript
// ❌ Bad: Exposes internal error details
catch (error) {
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}

// ✅ Good: Generic error message
catch (error) {
  console.error('Generation error:', error);
  return NextResponse.json(
    { error: 'Generation failed. Please try again.' },
    { status: 500 }
  );
}
```

### Structured Logging

```typescript
console.log(JSON.stringify({
  level: 'error',
  message: 'External API call failed',
  error: error.message,
  context: {
    service: 'replicate',
    prompt_length: prompt.length,
    timestamp: new Date().toISOString(),
  },
}));
```

View logs in Vercel Dashboard → Logs.

## Performance Tips

### 1. Minimize Cold Starts
- Keep function small
- Lazy-load heavy dependencies
- Avoid unnecessary imports at top level

### 2. Set Appropriate Timeouts

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(url, { signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeout);
}
```

### 3. Handle Timeouts Gracefully

```typescript
catch (error) {
  if (error.name === 'AbortError') {
    return NextResponse.json(
      { error: 'Request timeout' },
      { status: 504 }
    );
  }
  // Handle other errors...
}
```

### 4. Reuse HTTP Connections

```typescript
// ✅ Good: Keep connection alive
const response = await fetch(url, {
  keepalive: true,
});
```

## Testing Functions Locally

### Start Dev Server

```bash
npm run dev
```

### Test with curl

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a cute cat"}'
```

### Test with JavaScript

```typescript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'a cute cat' }),
});

const data = await response.json();
console.log(data);
```

## Common HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 404 | Not Found | Endpoint not found |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Server error |
| 504 | Gateway Timeout | Request timeout |

## Environment Variable Patterns

### Check for Missing Variables

```typescript
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// Use in function
const apiKey = getRequiredEnv('REPLICATE_API_KEY');
```

### Public vs Private Variables

```
// .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000  // Accessible in browser
REPLICATE_API_KEY=secret_key                // Only in Node.js
```

Public variables (prefix with `NEXT_PUBLIC_`) are exposed to browser. Never prefix secrets with `NEXT_PUBLIC_`.
