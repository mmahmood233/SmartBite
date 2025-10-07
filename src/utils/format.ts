/**
 * Format Utilities
 * Reusable formatting functions for consistent data display
 */

/**
 * Format currency with symbol
 * @param amount - Amount to format
 * @param currency - Currency symbol (default: 'BD')
 * @returns Formatted currency string (e.g., "BD 32.50")
 */
export const formatCurrency = (amount: number, currency = 'BD'): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @returns Formatted date (e.g., "Oct 5, 2025")
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date with time
 * @param date - Date string or Date object
 * @returns Formatted date with time (e.g., "Oct 5, 2025 at 3:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format time only
 * @param date - Date string or Date object
 * @returns Formatted time (e.g., "3:30 PM")
 */
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Get initials from full name
 * @param name - Full name
 * @returns Initials (e.g., "AF" from "Ahmed Faisal")
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with "..." if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Format phone number
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "+973 3356 0803")
 */
export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 11 && cleaned.startsWith('973')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format order number
 * @param orderNumber - Order number
 * @returns Formatted order number (e.g., "#WAJ1234")
 */
export const formatOrderNumber = (orderNumber: string): string => {
  return orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
};

/**
 * Pluralize word based on count
 * @param count - Number to check
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Pluralized string (e.g., "1 item" or "3 items")
 */
export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
};

/**
 * Format rating with decimal
 * @param rating - Rating number
 * @returns Formatted rating (e.g., "4.8")
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @returns Formatted percentage (e.g., "92%")
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};
