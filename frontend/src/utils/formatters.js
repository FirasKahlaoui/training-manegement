/**
 * Formats a number as Tunisian Dinar (TND)
 * Example: 12500.5 -> "12 500,500 TND"
 */
export const formatCurrencyTND = (value) => {
  if (value == null || isNaN(value)) return '0,000 TND';
  
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
};

/**
 * Formats a standard number (e.g., 10000 -> "10 000")
 */
export const formatNumber = (value) => {
  if (value == null || isNaN(value)) return '0';
  return new Intl.NumberFormat('fr-TN').format(value);
};
