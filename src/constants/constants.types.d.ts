declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //
      // shared
      NEXT_PUBLIC_BUILD_MODE?: 'development' | 'staging' | 'production';
      NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
      //
      // server
      GMAIL_USER_ADDRESS?: string,
      GMAIL_USER_APP_PASSWORD?: string;

    }
  }
}