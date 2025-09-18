import { ref, computed } from 'vue'
import { format, parseISO } from 'date-fns'

export function usePortfolioDates() {
  const formatDate = (date: string | Date, formatString = 'MMM d, yyyy'): string => {
    if (!date) return ''
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      return format(dateObj, formatString)
    } catch (e) {
      console.error('Error formatting date:', e)
      return String(date)
    }
  }

  const formatDateTime = (date: string | Date): string => {
    return formatDate(date, 'MMM d, yyyy h:mm a')
  }

  const formatDateShort = (date: string | Date): string => {
    return formatDate(date, 'MM/dd/yyyy')
  }

  const formatDateLong = (date: string | Date): string => {
    return formatDate(date, 'EEEE, MMMM d, yyyy')
  }

  const getCurrentDate = (): Date => {
    return new Date()
  }

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const isPast = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj < new Date()
  }

  const isFuture = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj > new Date()
  }

  const isToday = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    return dateObj.toDateString() === today.toDateString()
  }

  return {
    formatDate,
    formatDateTime,
    formatDateShort,
    formatDateLong,
    getCurrentDate,
    addDays,
    isPast,
    isFuture,
    isToday
  }
}

export default usePortfolioDates
