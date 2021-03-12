import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { localeMapForDate } from '../language/getLanguageName';

export default function formatDate(dateString: any) {
  if (dateString) {
    try {
      return format(parseISO(dateString), 'LLLL d, yyyy', {
        locale: localeMapForDate[localStorage.getItem('language') || 'en']
      });
    } catch (error) {
      console.log(error);
      return '';
    }
  } else {
    return '';
  }
}