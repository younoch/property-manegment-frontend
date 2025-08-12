import { useAuthStore } from '../stores/auth';

export default defineNuxtPlugin(async () => {
  const { initialize } = useAuthStore();
  
  // Initialize authentication and user stores
  await initialize();
});
