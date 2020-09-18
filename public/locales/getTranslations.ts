import de_me from './de/me.json';
import me from './en/me.json';

const language = 'de'
export function getMe() {
    switch (language) {
        case 'de': return de_me;
        case 'en': return me;
        default: return me
    }
}