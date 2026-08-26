/// <reference types="next" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_API_URL?: string;
      PORT?: string;
      NODE_ENV?: string;
    }
  }
}

declare module "*.env" {
  const content: NodeJS.ProcessEnv;
}

export {};
