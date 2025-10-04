import type { NotificationOptions } from '#ui/types'

export const useNotification = () => {
  const toast = useToast()
  
  const show = (options: NotificationOptions) => {
    return toast.add({
      timeout: 5000,
      ...options
    })
  }
  
  const success = (title: string, description?: string, options: Omit<NotificationOptions, 'title' | 'description' | 'color'> = {}) => {
    return show({
      title,
      description,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      ...options
    })
  }
  
  const error = (title: string, description?: string, options: Omit<NotificationOptions, 'title' | 'description' | 'color'> = {}) => {
    return show({
      title,
      description,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      ...options
    })
  }
  
  const info = (title: string, description?: string, options: Omit<NotificationOptions, 'title' | 'description' | 'color'> = {}) => {
    return show({
      title,
      description,
      color: 'blue',
      icon: 'i-heroicons-information-circle',
      ...options
    })
  }
  
  const warning = (title: string, description?: string, options: Omit<NotificationOptions, 'title' | 'description' | 'color'> = {}) => {
    return show({
      title,
      description,
      color: 'amber',
      icon: 'i-heroicons-exclamation-triangle',
      ...options
    })
  }
  
  const remove = (id: string | number) => {
    return toast.remove(id)
  }
  
  const clear = () => {
    return toast.clear()
  }
  
  return {
    show,
    success,
    error,
    info,
    warning,
    remove,
    clear
  }
}
