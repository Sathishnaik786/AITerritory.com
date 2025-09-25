// Type declarations for Netlify Edge Functions environment
import type { Context } from "@netlify/edge-functions";

declare global {
  const NETLIFY_KV: {
    get(key: string, options?: { type: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
    put(key: string, value: string | ReadableStream | ArrayBuffer, options?: { expiration?: string | number; expirationTtl?: string | number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; cursor?: string }): Promise<{ keys: { name: string; expiration?: number }[]; cursor?: string }>;
  };
}

export {};