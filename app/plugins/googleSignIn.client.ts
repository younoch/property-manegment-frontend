import GoogleSignIn from 'vue3-google-signin';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  // Initialize the Google Sign-In plugin
  nuxtApp.vueApp.use(GoogleSignIn, {
    clientId: config.public.googleClientId,
    scope: 'profile email',
    prompt: 'select_account'
  });
  
  return {
    provide: {
      googleSignIn: GoogleSignIn
    }
  };
});
