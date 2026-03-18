/**
 * Core type definitions for Premium Sticker Maker
 */

// ============ AUTH ============
export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// ============ GENERATION ============
export interface GenerationRequest {
  prompt: string;
  style?: string;
  modelVersion?: string;
}

export interface GenerationResponse {
  imageUrl: string;
  generatedAt: string;
  generationTime: number;
  model: string;
}

export interface GenerationError {
  error: string;
  code: string;
  retryAfter?: number;
}

// ============ STYLE SYSTEM ============
export interface Style {
  id: string;
  name: string;
  description: string;
  promptEnhancer: string; // Text to append to prompt
  exampleImage?: string;
  category?: string;
}

export interface StyledPrompt {
  original: string;
  enhanced: string;
  appliedStyle: Style;
}

// ============ UI STATE ============
export interface GenerationState {
  prompt: string;
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
  startTime: number | null;
  elapsedTime: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AppState extends AuthState, GenerationState {
  selectedStyle: Style | null;
  isAuthModalOpen: boolean;
  isPreviewModalOpen: boolean;
}

// ============ API RESPONSES ============
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: string;
  status: number;
}

// ============ COMPONENT PROPS ============
export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface StyleCardProps {
  style: Style;
  isSelected?: boolean;
  onClick: (style: Style) => void;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
}

export interface PreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  generationTime?: number;
  onClose: () => void;
  onRegenerate: () => void;
  onNewGeneration: () => void;
  onDownload: () => void;
  onShare?: () => void;
}

// ============ NANO BANANA INTEGRATION ============
export interface NanoBananaRequest {
  model_name: string;
  input: {
    prompt: string;
    num_outputs?: number;
    num_inference_steps?: number;
    guidance_scale?: number;
    seed?: number;
  };
}

export interface NanoBananaResponse {
  call_id: string;
  result: {
    output: string[];
  };
}

// ============ FETCH WRAPPER ============
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions extends RequestInit {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}
