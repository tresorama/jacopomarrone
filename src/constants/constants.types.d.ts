namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    //
    // shared
    NEXT_PUBLIC_BUILD_MODE: 'development' | 'staging' | 'production';
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: string;
    //
    // server
    MAILJET_API_KEY: string;
    MAILJET_API_SECRET: string;
  }
}