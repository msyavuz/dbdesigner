declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      DATABASE_URL: string;
      TEST_DATABASE_URL?: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};
