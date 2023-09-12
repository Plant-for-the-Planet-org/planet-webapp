import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { localeMapForDate } from '../language/getLanguageName';

/**
 * Formats a date string according to the user's preferred language.
 *
 * @param {string} Parse the given string in ISO 8601 format.
 * @returns {string} The formatted date string.
 */

export default function formatDate(dateString: string) {
  if (dateString) {
    try {
      return format(parseISO(dateString), 'LLLL d, yyyy', {
        locale: localeMapForDate[localStorage.getItem('language') || 'en'],
      });
    } catch (error) {
      console.log(error);
      return '';
    }
  } else {
    return '';
  }
}
