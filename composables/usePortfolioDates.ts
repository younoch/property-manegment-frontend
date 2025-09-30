import { usePortfolioStore } from '~/stores/portfolio'
import { format, parseISO, formatInTimeZone } from 'date-fns-tz'

export const usePortfolioDates = () => {
  const portfolioStore = usePortfolioStore()
  
  // Format a date in the portfolio's timezone
  const formatDate = (date: Date | string | null | undefined, formatString = 'PPP', options = {}) => {
    if (!date) return ''
    
    const timeZone = portfolioStore.currentTimezone || 'UTC'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    try {
      return formatInTimeZone(dateObj, timeZone, formatString, {
        timeZone,
        ...options
      })
    } catch (e) {
      return 'Invalid date'
    }
  }
  
  // Format a date range in the portfolio's timezone
  const formatDateRange = (startDate: Date | string, endDate: Date | string, formatString = 'PPP', options = {}) => {
    const start = formatDate(startDate, formatString, options)
    const end = formatDate(endDate, formatString, options)
    return `${start} - ${end}`
  }
  
  // Parse a date string in the portfolio's timezone
  const parseDate = (dateString: string) => {
    const timeZone = portfolioStore.currentTimezone || 'UTC'
    return parseISO(dateString, { timeZone })
  }
  
  // Get today's date in the portfolio's timezone
  const getToday = () => {
    const timeZone = portfolioStore.currentTimezone || 'UTC'
    return formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd')
  }
  
  // Format a date for API submission (YYYY-MM-DD)
  const formatForApi = (date: Date | string | null | undefined) => {
    if (!date) return ''
    return formatDate(date, 'yyyy-MM-dd')
  }
  
  // Get the timezone abbreviation (e.g., 'EST', 'PST')
  const getTimezoneAbbreviation = () => {
    const timeZone = portfolioStore.currentTimezone || 'UTC'
    try {
      return new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(new Date())
        .find(part => part.type === 'timeZoneName')?.value || timeZone
    } catch (e) {
      return timeZone
    }
  }
  
  return {
    formatDate,
    formatDateRange,
    parseDate,
    getToday,
    formatForApi,
    getTimezoneAbbreviation,
    currentTimezone: portfolioStore.currentTimezone
  }
}
