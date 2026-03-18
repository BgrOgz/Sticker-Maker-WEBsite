# Sticker Maker 3D - Coding Standards & Rules

**IMPORTANT:** These rules apply to ALL commits in this project. They are non-negotiable and must be followed before every commit. This document defines once and for all—no repetition needed in reviews.

---

## 1. Testing Rule: No Commits Without Tests

### The Rule
**Every feature, fix, or refactoring MUST have corresponding test coverage before being committed.**

### What Counts as "Tests"
- Unit tests for utility functions
- Component tests for React components
- Integration tests for API endpoints
- E2E tests for critical user flows (optional)

### Implementation Requirements
```typescript
// ✅ Good: Component with tests
// src/components/ui/PromptInput.tsx
export function PromptInput({ onSubmit }: Props) { /* ... */ }

// src/components/ui/__tests__/PromptInput.test.tsx
describe('PromptInput', () => {
  it('submits prompt on Enter key', () => { /* test */ });
  it('validates prompt length', () => { test */ });
  it('disables button during loading', () => { /* test */ });
});

// ❌ Bad: Component without tests
export function PromptInput({ onSubmit }: Props) { /* ... */ }
// No tests = cannot commit
```

### Test File Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── PromptInput.tsx
│   │   └── __tests__/
│   │       └── PromptInput.test.tsx
│   └── 3d/
│       ├── StickerCanvas.tsx
│       └── __tests__/
│           └── StickerCanvas.test.tsx
├── utils/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts
└── hooks/
    ├── useGeneration.ts
    └── __tests__/
        └── useGeneration.test.ts
```

### Test Command
```bash
# Before every commit, run:
npm test

# All tests must pass. No exceptions.
# npm test should exit with code 0.
```

### What Must Be Tested
| Code Type | Must Test | Examples |
|-----------|-----------|----------|
| **Utility Functions** | ✅ Yes | `validatePrompt()`, `formatDate()` |
| **Components** | ✅ Yes | `PromptInput`, `StickerCanvas`, `LoadingSpinner` |
| **Hooks** | ✅ Yes | `useGeneration`, `useStickerState` |
| **API Routes** | ✅ Yes | `POST /api/generate` |
| **Validation** | ✅ Yes | Input validation, rate limiting |
| **Constants** | ❌ No | Simple value exports |
| **Re-exports** | ❌ No | Index files that just re-export |

### Commit Checklist
Before `git commit`, verify:
- [ ] `npm test` passes (exit code 0)
- [ ] No test warnings or skipped tests (`test.skip`, `xit`)
- [ ] Test coverage reasonable (aim for 70%+ on changed files)
- [ ] Tests are not trivial (actually verify behavior)

---

## 2. TypeScript Rule: No `any` Types

### The Rule
**The `any` type is FORBIDDEN. Use proper TypeScript typing in all code. No exceptions.**

### Why
- `any` defeats the purpose of TypeScript
- Hides bugs that strict typing would catch
- Makes refactoring dangerous
- Breaks IDE autocomplete

### Alternatives to `any`

#### ❌ Bad: Using `any`
```typescript
function processData(data: any) {
  return data.name.toUpperCase();
}

const response: any = await fetch('/api/data');

function handleClick(e: any) {
  // No type info on event
}
```

#### ✅ Good: Proper Typing
```typescript
// Define interface first
interface User {
  name: string;
  email: string;
}

function processData(data: User) {
  return data.name.toUpperCase();
}

// Type API response
interface ApiResponse {
  imageUrl: string;
  generatedAt: string;
}

const response = await fetch('/api/data');
const data: ApiResponse = await response.json();

// Type React events
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.disabled = true;
}
```

### TypeScript Patterns

#### Generic Types
```typescript
// ✅ Good: Generic with type parameter
function useState<T>(initial: T): [T, (v: T) => void] {
  // ...
}

// ❌ Bad: Any
function useState(initial: any): [any, (v: any) => void] {
  // ...
}
```

#### Union Types (for flexibility)
```typescript
// ✅ Good: Specific union
type Status = 'idle' | 'loading' | 'success' | 'error';

function setStatus(status: Status) {
  // Only accepts valid statuses
}

// ❌ Bad: Any
function setStatus(status: any) {
  // Accepts anything
}
```

#### Type Guards
```typescript
// ✅ Good: Proper type narrowing
function processValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value * 2;
  }
  throw new Error('Unexpected type');
}

// ❌ Bad: Using any
function processValue(value: any) {
  return value.toUpperCase(); // unsafe
}
```

### Component Props
```typescript
// ✅ Good: Typed props interface
interface ButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Button({ onClick, disabled, children }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ❌ Bad: Untyped props
export function Button(props: any) {
  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
}
```

### Vercel Function Types
```typescript
// ✅ Good: Typed API route
import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
}

interface GenerateResponse {
  imageUrl: string;
  generatedAt: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateResponse>> {
  const body: GenerateRequest = await request.json();
  // ...
  return NextResponse.json({ imageUrl, generatedAt });
}

// ❌ Bad: Untyped
export async function POST(request: any): any {
  const body: any = await request.json();
  return NextResponse.json(body);
}
```

### Commit Checklist
Before committing, verify:
- [ ] `npm run type-check` passes (no errors)
- [ ] No `any` in code (search for it)
- [ ] All function parameters typed
- [ ] All function return types typed
- [ ] Component props have interface
- [ ] API requests/responses have types

---

## 3. Console Rule: No console.log Left Behind

### The Rule
**No `console.log()`, `console.error()`, `console.warn()`, or `debugger` statements in committed code. All logging must be removed before commit.**

### What's Forbidden
```typescript
// ❌ All of these forbidden in committed code:
console.log('Debug message');
console.error('Error:', error);
console.warn('Warning!');
console.debug('Debug info');
console.info('Info message');
debugger; // Breakpoint statement
console.trace(); // Stack trace
```

### Exception: Structured Server Logging
**Only this pattern is allowed in production code:**

```typescript
// ✅ Allowed: Structured error logging in API routes only
// src/app/api/generate/route.ts
export async function POST(request: NextRequest) {
  try {
    // ...
  } catch (error) {
    // ONLY in API routes/backend code, use structured logging:
    console.log(JSON.stringify({
      level: 'error',
      message: 'Generation failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      context: { prompt_length: prompt.length },
    }));

    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
```

**Rules for server logging:**
- Must be JSON.stringify (machine-readable)
- Must include: level, message, timestamp, context
- Must NOT include sensitive data (API keys, tokens)
- Use only in backend (API routes)

### Development vs Production
```typescript
// ❌ Bad: Conditional logging (still forbidden)
if (process.env.NODE_ENV === 'development') {
  console.log('Debug'); // NO - removes before commit anyway
}

// ✅ Good: Keep code clean, no logging at all
// Use browser DevTools or IDE debugger for development
```

### Finding Leftover Logs
```bash
# Before committing, check for logs:
grep -r "console\." src/ --include="*.ts" --include="*.tsx"
grep -r "debugger" src/ --include="*.ts" --include="*.tsx"

# Should return: (empty output)
# If output exists, you have logs to remove
```

### Debugging During Development
```typescript
// During development, use IDE debugger:
// 1. Set breakpoint (click line number in VS Code)
// 2. Run: npm run dev
// 3. Browser stops at breakpoint
// 4. Inspect variables in DevTools

// For 3D debugging, use Three.js helper:
import { OrbitControls, Stats } from '@react-three/drei';

export function Scene() {
  return (
    <>
      <Stats /> {/* Shows FPS, memory (dev only) */}
      <OrbitControls />
    </>
  );
}
```

### Commit Checklist
Before committing, verify:
- [ ] No `console.log` in frontend code
- [ ] No `console.error` left over
- [ ] No `debugger` statements
- [ ] Only structured logging in API routes (if needed)
- [ ] Run: `grep -r "console\." src/` (should be empty or only JSON.stringify in api/)

---

## 4. Import Rule: No Unused Imports

### The Rule
**Every import must be used. No dead code, no unused variables, no orphaned imports.**

### Examples

#### ❌ Bad: Unused Imports
```typescript
import React from 'react'; // Not using React
import { useState, useEffect } from 'react';
import { StickerCanvas } from '@/components/3d'; // Not using StickerCanvas
import { validatePrompt } from '@/utils'; // Not used

export function Component() {
  const [count, setCount] = useState(0); // setCount never used

  return <div>{count}</div>;
}
```

#### ✅ Good: All Imports Used
```typescript
import { useState } from 'react'; // Used for state

export function Component() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Detecting Unused Imports
```bash
# ESLint will catch these automatically
npm run lint

# Output example:
# src/components/ui/Button.tsx
#   5:9  error  'useState' is defined but never used  no-unused-vars
```

### Commit Checklist
Before committing, verify:
- [ ] `npm run lint` shows no unused import warnings
- [ ] No `// eslint-disable-line` comments to suppress warnings
- [ ] All imported items actually used in code
- [ ] No imports of types that aren't used

---

## 5. Error Handling Rule: No Silent Failures

### The Rule
**Every operation that can fail MUST have error handling. Never use try/catch without actually handling the error.**

### What Must Have Error Handling

| Operation | Must Handle | How |
|-----------|-------------|-----|
| **API Calls** | ✅ Yes | catch, error response |
| **Data Parsing** | ✅ Yes | try/catch, validation |
| **File Operations** | ✅ Yes | error handling |
| **Async Operations** | ✅ Yes | error boundary, catch |
| **User Input** | ✅ Yes | validation, error message |
| **External Service Calls** | ✅ Yes | timeout, retry, fallback |

### Examples

#### ❌ Bad: Silent Failure
```typescript
// Bad 1: No error handling at all
async function generateSticker(prompt: string) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return data.imageUrl;
}

// Bad 2: Try/catch without handling
async function generateSticker(prompt: string) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    // Error caught but not handled - silent failure
  }
}

// Bad 3: No response checking
async function generateSticker(prompt: string) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  // What if response.ok is false? Crashes silently
  const data = await response.json();
  return data.imageUrl;
}
```

#### ✅ Good: Proper Error Handling
```typescript
// Good: Full error handling
async function generateSticker(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    }

    const data = await response.json();

    if (!data.imageUrl) {
      throw new Error('No image URL in response');
    }

    return data.imageUrl;
  } catch (error) {
    // Properly handle error
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate sticker: ${message}`);
  }
}

// In component:
async function handleGenerate(prompt: string) {
  setStatus('loading');
  try {
    const imageUrl = await generateSticker(prompt);
    setStickerUrl(imageUrl);
    setStatus('success');
  } catch (error) {
    setError(error.message);
    setStatus('error');
  }
}
```

### API Route Error Handling
```typescript
// ✅ Good: API route with complete error handling
export async function POST(request: NextRequest) {
  try {
    // 1. Validate input
    const body = await request.json();
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt required' },
        { status: 400 }
      );
    }

    // 2. Rate limit
    if (isRateLimited(request)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // 3. Call external service with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('https://api.replicate.com/...', {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return NextResponse.json(result);
    } finally {
      clearTimeout(timeout);
    }

  } catch (error) {
    // 4. Log error with context
    console.log(JSON.stringify({
      level: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
    }));

    // 5. Return safe error response
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
```

### Commit Checklist
Before committing, verify:
- [ ] All API calls have try/catch
- [ ] API responses checked for ok/error
- [ ] User input validated before use
- [ ] Error messages shown to user
- [ ] No empty catch blocks
- [ ] Timeout handling for slow operations
- [ ] External service calls have fallback

---

## 6. Security Rule: No Secrets in Code

### The Rule
**API keys, passwords, tokens, and any secrets MUST NEVER appear in code. All secrets stored in environment variables only.**

### What Are Secrets?
- API keys (Replicate, Stability, OpenAI, etc.)
- Database passwords
- OAuth tokens
- Session secrets
- Database connection strings (with credentials)
- Private signing keys

### ❌ Bad: Secrets in Code
```typescript
// FORBIDDEN: API key in code
const REPLICATE_API_KEY = 'p_abc123xyz456';

// FORBIDDEN: In comments
// const API_KEY = 'p_secret'; // Don't commit this!

// FORBIDDEN: In environment but not gitignored
// .env.local (should be gitignored)
REPLICATE_API_KEY=p_abc123xyz456

// FORBIDDEN: In URL/fetch
fetch('https://api.service.com/v1/predictions', {
  headers: {
    'Authorization': 'Bearer p_xyz123',
  },
});

// FORBIDDEN: Default value with secret
const apiKey = process.env.REPLICATE_API_KEY || 'p_fallback_key';
```

### ✅ Good: Secrets in Environment
```typescript
// GOOD: Read from environment variable
const apiKey = process.env.REPLICATE_API_KEY;

if (!apiKey) {
  throw new Error('REPLICATE_API_KEY not set');
}

// GOOD: Template file documents what's needed
// .env.example (committed to Git)
REPLICATE_API_KEY=

// GOOD: Actual values in .env.local (gitignored)
// .env.local (NOT committed)
REPLICATE_API_KEY=p_abc123xyz456

// GOOD: Vercel Dashboard for production
// Settings → Environment Variables
REPLICATE_API_KEY=prod_key_xyz

// GOOD: Use in API route only
export async function POST(request: NextRequest) {
  const apiKey = process.env.REPLICATE_API_KEY;

  const response = await fetch('https://api.service.com/v1/predictions', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  // ...
}

// GOOD: Template for documentation
interface Config {
  replicateApiKey: string;
  appUrl: string;
}

export function getConfig(): Config {
  const apiKey = process.env.REPLICATE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing REPLICATE_API_KEY environment variable');
  }

  return {
    replicateApiKey: apiKey,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };
}
```

### .gitignore Requirements
```bash
# Must be in .gitignore (Next.js adds these by default)
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# Also ignore:
*.key
*.pem
secrets/
```

### Checking for Secrets
```bash
# Search for common secret patterns
grep -r "REPLICATE_API_KEY\|API_KEY\|SECRET\|TOKEN" src/ \
  --include="*.ts" --include="*.tsx" \
  | grep -v "process.env"

# If output contains assignments or hardcoded values: FIX IT

# Check git history for accidentally committed secrets
git log --all -S "REPLICATE_API_KEY" --source
```

### Secret Rotation
If a secret is accidentally committed:
1. **Immediately** invalidate the key (in Replicate, OpenAI, etc.)
2. Create a new key
3. Update Vercel Dashboard
4. Add to `.env.example` documentation
5. Force push is NOT recommended (keep history)

### Commit Checklist
Before committing, verify:
- [ ] No API keys in any code
- [ ] No hardcoded secrets
- [ ] `process.env.` used for all secrets
- [ ] `.env.local` is gitignored
- [ ] `.env.example` has no actual values
- [ ] Grep check: `grep -r "API_KEY\|SECRET" src/` returns nothing

---

## 7. Type Safety Rule: strict: true

### The Rule
**TypeScript must be configured with `strict: true`. All strict mode rules are enforced.**

### tsconfig.json Requirement
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### What Strict Mode Enforces

#### No Implicit Any
```typescript
// ❌ Bad: Type not specified
function add(a, b) {
  return a + b;
}

// ✅ Good: Types explicit
function add(a: number, b: number): number {
  return a + b;
}
```

#### Null/Undefined Checks
```typescript
// ❌ Bad: Could be null
function getName(user: User) {
  return user.name.toUpperCase(); // Error if user.name is null
}

// ✅ Good: Handle null
function getName(user: User) {
  return user.name?.toUpperCase() ?? 'Unknown';
}
```

#### Return Types
```typescript
// ❌ Bad: No return type
async function fetchData() {
  return await fetch('/api/data').then(r => r.json());
}

// ✅ Good: Return type specified
async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  return await response.json();
}
```

### Pre-Commit Check
```bash
# Must pass before committing:
npm run type-check

# Should exit with code 0 and no errors
# Example output:
# tsc --noEmit
# (empty = all good)
```

### Commit Checklist
Before committing, verify:
- [ ] `npm run type-check` passes
- [ ] No TypeScript errors or warnings
- [ ] tsconfig.json has `"strict": true`
- [ ] All functions have return types
- [ ] All parameters typed
- [ ] No implicit any

---

## 8. Documentation Rule: Comments Where Needed

### The Rule
**Code should be self-documenting. Add comments only for "why", not "what". Avoid obvious comments.**

### ❌ Bad Comments (Self-Documenting Code)
```typescript
// ❌ Don't comment the obvious
function validatePrompt(prompt: string): boolean {
  // Check if prompt is long enough
  if (prompt.length < 3) {
    return false;
  }

  // Check if prompt is not too long
  if (prompt.length > 256) {
    return false;
  }

  // Return true
  return true;
}
```

### ✅ Good: Self-Documenting with Minimal Comments
```typescript
// ✅ Code is clear, only comment non-obvious business logic
function validatePrompt(prompt: string): boolean {
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 256;

  if (prompt.length < MIN_LENGTH || prompt.length > MAX_LENGTH) {
    return false;
  }

  return true;
}

// If there's a specific reason for these limits:
function validatePrompt(prompt: string): boolean {
  // AI models require at least 3 chars for meaningful context
  // Limit to 256 to fit in Twitter-length prompts for sharing
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 256;

  return prompt.length >= MIN_LENGTH && prompt.length <= MAX_LENGTH;
}
```

### When to Comment
| Situation | Comment? | Example |
|-----------|----------|---------|
| **Complex algorithm** | ✅ Yes | "Exponential backoff retry logic" |
| **Business logic reason** | ✅ Yes | "API has 60s timeout per spec" |
| **Non-obvious decision** | ✅ Yes | "Using in-memory cache vs Vercel KV for perf" |
| **Variable name is clear** | ❌ No | `const userName` doesn't need comment |
| **Function does what name says** | ❌ No | `validatePrompt()` is clear |
| **Simple if statement** | ❌ No | `if (isLoading)` doesn't need comment |

### Function Documentation
```typescript
// ✅ Good: JSDoc only for non-obvious behavior
/**
 * Polls Replicate API until prediction completes or timeout.
 *
 * Replicate predictions are async, so we need to poll for completion.
 * Max 55s timeout leaves 5s buffer for response processing.
 *
 * @param predictionId - Replicate prediction UUID
 * @returns Image URL when complete
 * @throws Error if prediction fails or timeout
 */
async function pollForCompletion(predictionId: string): Promise<string> {
  const MAX_WAIT_MS = 55000; // 60s total timeout - 5s buffer
  const POLL_INTERVAL_MS = 1000;
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT_MS) {
    const prediction = await getPrediction(predictionId);

    if (prediction.status === 'succeeded') {
      return prediction.output[0];
    }

    if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('Prediction timeout');
}

// ❌ Bad: Over-commented, obvious code
/**
 * Gets the prediction with the given ID
 * @param id - The ID to get
 * @returns The prediction
 */
function getPrediction(id: string) {
  // Get the prediction
  const result = api.get(`/predictions/${id}`);
  // Return it
  return result;
}
```

### Commit Checklist
Before committing, verify:
- [ ] Comments explain "why", not "what"
- [ ] No obvious/redundant comments
- [ ] Complex algorithms documented
- [ ] Business logic reasons explained
- [ ] Code is self-documenting (clear names, structure)

---

## Pre-Commit Checklist

Before every commit, run this checklist:

```bash
# 1. Run all checks
npm run type-check      # TypeScript ✅
npm run lint            # ESLint ✅
npm test                # Tests ✅
npm run build           # Production build ✅

# 2. Verify no secrets
grep -r "REPLICATE_API_KEY\|API_KEY\|SECRET" src/ --include="*.ts" --include="*.tsx" | grep -v "process.env"
# (Should output nothing)

# 3. Verify no console logs
grep -r "console\." src/ --include="*.ts" --include="*.tsx"
# (Should show nothing or only structured logging in /api/)

# 4. Verify no debugger
grep -r "debugger" src/ --include="*.ts" --include="*.tsx"
# (Should output nothing)

# 5. Check for unused imports
npm run lint
# (ESLint should report no "unused" warnings)

# 6. Verify git status
git status
# (Only expected files changed)

# 7. Review code
git diff --staged
# (Check your changes one more time)

# 8. Commit with good message
git commit -m "feat: add sticker rotation control"
# Format: type(scope): description
# Types: feat, fix, refactor, docs, test, chore
```

---

## Why These Rules Exist

| Rule | Purpose |
|------|---------|
| **Testing** | Prevent bugs, ensure refactoring safety, document expected behavior |
| **No `any`** | Catch errors early, enable IDE assistance, prevent runtime surprises |
| **No console.log** | Keep codebase clean, reduce accidental leaks, improve readability |
| **No unused imports** | Reduce bundle size, clarify dependencies, prevent accidental removal |
| **Error handling** | Provide good UX, enable debugging, prevent silent failures |
| **No secrets** | Prevent credential leaks, security breach, unauthorized access |
| **strict: true** | Catch type errors early, refactoring confidence, IDE features |
| **Comments** | Document non-obvious logic, explain business decisions |

---

## Questions?

**Q: What if I just need to quickly test something?**
A: Even quick changes need tests. Tests document behavior and prevent regressions. Invest 2 minutes in a test.

**Q: Can I use `any` just this once?**
A: No. If you can't type it properly, refactor. `any` is the enemy of good code.

**Q: What if I need console.log for debugging?**
A: Use IDE debugger. Set breakpoint (click line number), run app, inspect variables. Much better than logs.

**Q: Do I really need to test everything?**
A: Yes. But focus on behavior, not implementation. Test: does it work? Does it handle errors?

**Q: My commit message doesn't fit the format...**
A: Make it fit. Good messages are: `type(scope): description`. Example: `fix(api): handle rate limit timeout`

---

**Last Updated:** 2024-03-18
**Status:** Final - No exceptions, no repetition needed
**Enforcement:** Pre-commit automated checks + code review verification
