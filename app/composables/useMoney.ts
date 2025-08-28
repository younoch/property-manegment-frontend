import { computed } from 'vue'

export function useMoney() {
  const currency = 'BDT'
  const locale = 'en-BD'

  const formatMoney = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '৳0.00'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount).replace(/^\D+/, '৳')
  }

  const formatMoneyNoSymbol = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '0.00'
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount)
  }

  const formatMoneyRounded = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '৳0'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(numAmount)).replace(/^\D+/, '৳')
  }

  const parseMoney = (value: string): number => {
    if (!value) return 0
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    return parseFloat(numericValue) || 0
  }

  const add = (a: number, b: number): number => {
    return Math.round((a + b) * 100) / 100
  }

  const subtract = (a: number, b: number): number => {
    return Math.round((a - b) * 100) / 100
  }

  const multiply = (a: number, b: number): number => {
    return Math.round(a * b * 100) / 100
  }

  const divide = (a: number, b: number): number => {
    if (b === 0) return 0
    return Math.round((a / b) * 100) / 100
  }

  const isPositive = (amount: number): boolean => {
    return amount > 0
  }

  const isNegative = (amount: number): boolean => {
    return amount < 0
  }

  const isZero = (amount: number): boolean => {
    return amount === 0
  }

  return {
    currency,
    formatMoney,
    formatMoneyNoSymbol,
    formatMoneyRounded,
    parseMoney,
    add,
    subtract,
    multiply,
    divide,
    isPositive,
    isNegative,
    isZero
  }
}

export default useMoney
