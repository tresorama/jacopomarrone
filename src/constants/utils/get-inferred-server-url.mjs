
const isBrowser = () => typeof window !== 'undefined';

/**
 * Get the server base URL by inferring the environment.  
 * 
 * If called from `browser` -> returns empty string (relative path usage).  
 * If called from `server` -> try to recognize the URL from env vars injected by the deploy service, if nothing found ->  fallback to `127.0.0.1:3000`.  
 * 
 * NOTE: recognized deploy services: `netlify.com`, `vercel.com`, `render.com`
 */
export function getInferredBaseUrl() {
  // if browser
  if (isBrowser()) {
    // browser should use relative path
    return '';
  }

  // if is server..
  return (
    inferNetlifyUrl()
    || inferVercelUrl()
    || inferRenderUrl()
    || `http://localhost:${process.env.PORT ?? 3000}`
  );
}



/** Get deploy netlify url if this app is built on vercel, or null otherwise */
function inferNetlifyUrl() {

  // NOTE: https://docs.netlify.com/build/configure-builds/environment-variables/

  // NOTE:
  // - NETLIFY=true if deployed on netlify
  // - BRANCH:
  //     - i.e. `main`
  //     - is the git branch of the deployment
  // - DEPLOY_URL:
  //     - i.e. `https://5b243e66dd6a547b4fee73ae--petsof.netlify.app`
  //     - is the immutable deplyment url.
  //     - changes on each deployment
  // - DEPLOY_PRIME_URL:
  //     - i.e. `https://deploy-preview-1--petsof.netlify.app`
  //     - is the deplyment url of the gruoup (deploy preview for the same PR, ...).
  //     - changes when the group changees
  // - URL:
  //     - i.e. `https://my-project.netlify.app`
  //     - is the fixed production url of the project on Vercel
  //     - does not change across deployments
  //     - if custom domain is used, this is the custom domain
  //     - if no custom domain is used, this is the auto-assigned by netlify production url

  // if we are on netlify...
  if (process.env.NETLIFY === 'true') {

    // ...and this git branch is main and we have a netlify production url...
    if (process.env.BRANCH === 'main' && process.env.URL) {
      return process.env.URL;
    }

    // ...and this git branch is not main and we have a netlify deployment url...
    if (process.env.BRANCH !== 'main' && process.env.DEPLOY_PRIME_URL) {
      return process.env.DEPLOY_PRIME_URL;
    }
    if (process.env.BRANCH !== 'main' && process.env.DEPLOY_URL) {
      return process.env.DEPLOY_URL;
    }
  }

  return null;

};


/** Get deploy vercel url if this app is built on vercel, or null otherwise */
function inferVercelUrl() {

  // NOTE:
  // - VERCEL=1 if deployed on vercel
  // - VERCEL_GIT_COMMIT_REF:
  //     - i.e. `main`
  //     - is the git branch of the deployment
  // - VERCEL_URL:
  //     - i.e. `my-project-4535c432342x4234.vercel.app`
  //     - is the immutable deplyment url.
  //     - changes on each deployment
  // - VERCEL_PROJECT_PRODUCTION_URL:
  //     - i.e. `my-project.vercel.app`
  //     - is the fixed production url of the project on Vercel
  //     - does not change across deployments
  //     - if custom domain is used, this is the custom domain
  //     - if no custom domain is used, this is the auto-assigned by vercel production url

  // if we are on vercel...
  if (process.env.VERCEL === '1') {

    // ...and this git branch is main and we have a vercel production url...
    if (process.env.VERCEL_GIT_COMMIT_REF === 'main' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // ...and this git branch is not main and we have a vercel deployment url...
    if (process.env.VERCEL_GIT_COMMIT_REF !== 'main' && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
  }

  return null;

};


/** Get deploy render url if this app is built on render, or null otherwise */
function inferRenderUrl() {
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }
  return null;
}