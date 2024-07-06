import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { localeMapForDate } from '../language/getLanguageName';

export default function formatDate(date: number | Date | string) {
  if (date) {
    try {
      if (typeof date === 'string') {
        return format(parseISO(date), 'LLLL d, yyyy', {
          locale: localeMapForDate[localStorage.getItem('language') || 'en'],
        });
      }
      else {
        return format(date, 'LLLL d, yyyy', {
          locale: localeMapForDate[localStorage.getItem('language') || 'en'],
        });
      }
    } catch (error) {
      console.log(error);
      return '';
    }
  } else {
    return '';
  }
}
