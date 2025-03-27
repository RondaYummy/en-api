declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';

      // PostgreSQL
      POSTGRES_DB: string;
      POSTGRES_PASSWORD: string;
      DATABASE_URL: string;
      USE_SSL_FOR_DATABASE?: string;

      // Redis
      REDIS_HOST: string;
      REDIS_PORT: string;

      // Application
      PORT: string;
      OPENAI_API_KEY: string;
      FRONTEND_DOMAIN: string;
      FRONTEND_URL: string;
    }
  }
}

export { };
