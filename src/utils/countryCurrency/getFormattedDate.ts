import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import en from 'date-fns/locale/en-US';
import de from 'date-fns/locale/de';
import es from 'date-fns/locale/es';
import fr from 'date-fns/locale/fr';
import it from 'date-fns/locale/it';
import pt from 'date-fns/locale/pt';
import ptBR from 'date-fns/locale/pt-BR';

const localeObjects = { 'en': en, 'de': de , 'es': es , 'fr': fr , 'it': it, 'pt': pt , 'pt-BR': ptBR };

export default function formatDate(dateString: any) {
  if (dateString) {
    try {
      return format(parseISO(dateString), 'LLLL d, yyyy', {
        locale: localeObjects[localStorage.getItem('language') || 'en']
      });
    } catch (error) {
      console.log(error);
      return '';
    }
  } else {
    return '';
  }
};