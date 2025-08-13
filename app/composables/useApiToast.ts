import { useToast } from '#imports';

export function useApiToast() {
  const toast = useToast();

  function success(message: string, title = 'Success') {
    toast.add({ title, description: message, color: 'success' });
  }

  function error(message: string, title = 'Error') {
    toast.add({ title, description: message, color: 'error' });
  }

  return { success, error };
}

