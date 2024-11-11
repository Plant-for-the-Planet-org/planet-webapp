import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { localeMapForDate } from '../language/getLanguageName';

export default function formatDate(date: number | Date | string) {
  if (!date) {
    return '';
  }

  try {
    if (typeof date === 'string') {
      // Clean up date string
      const cleanDateString = date.split(' ')[0]; // Remove time portion
      if (!cleanDateString.includes('-')) {
        return '';
      }
      // Zero-padding month and day if needed
      const [year, month, day] = cleanDateString.split('-');
      if (!year || !month || !day) {
        return '';
      }
      // Validate ranges
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
        return '';
      }
      const isoDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}`;
      return format(parseISO(isoDateString), 'LLLL d, yyyy', {
        locale: localeMapForDate[localStorage.getItem('language') || 'en'],
      });
    } else {
      return format(date, 'LLLL d, yyyy', {
        locale: localeMapForDate[localStorage.getItem('language') || 'en'],
      });
    }
  } catch (error) {
    console.error('Date formatting failed:', {
      input: date,
      error: error instanceof Error ? error.message : String(error),
    });
    return '';
  }
}
