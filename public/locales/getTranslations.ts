import de_me from './de/me.json';
import me from './en/me.json';
import es_me from './es/me.json';

let language = 'en';

let localLanguage = localStorage.getItem('language')
if (localLanguage) {
    language = localLanguage
}

export function getMe() {
    switch (language) {
        case 'de': return de_me;
        case 'es': return es_me;
        case 'en': return me;
        default: return me
    }
}