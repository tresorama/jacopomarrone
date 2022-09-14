// React Component that inject <script> in the page
//
// Theses components are created for Next.js (use next/script)
// If used with another frameworks, remember to adapt them.
export { GoogleTagManagerHead, GoogleTagManagerBody } from './components/gtm';

// Frontend GTM Events
export { default as GTM_CustomEventDispatcher } from './gtm-custom-events-dispatcher';
export { default as GTM_Events } from './gtm-events';