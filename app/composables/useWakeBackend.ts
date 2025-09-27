import { ref } from 'vue';
import { createApiClient } from '~/utils/api';

export const useWakeBackend = () => {
  const apiClient = createApiClient();
  const isWakingUp = ref(false);
  const wakeUpError = ref<Error | null>(null);

  const wakeBackend = async () => {
    if (isWakingUp.value) return;
    
    isWakingUp.value = true;
    wakeUpError.value = null;
    
    try {
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await apiClient.get('/health', {
        signal: controller.signal,

      }).catch(() => {});
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.debug('Wake-up call failed, but continuing anyway:', error);
      wakeUpError.value = error as Error;
    } finally {
      isWakingUp.value = false;
    }
  };

  return {
    wakeBackend,
    isWakingUp,
    wakeUpError,
  };
};
export default useWakeBackend;
