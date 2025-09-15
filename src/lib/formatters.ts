/**
 * Formatage des devises, dates et nombres selon les specs DOT
 * Devise: USD, Timezone: Europe/Paris, Séparateur milliers: espace
 */

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Remplacer $US par $ et normaliser les espaces
  return formatted.replace('$US', '$').replace(/\s/g, ' ');
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

export function formatDateTimeInput(dateString: string): string {
  const date = new Date(dateString);
  // Format pour input datetime-local
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}