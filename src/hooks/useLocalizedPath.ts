import { useLocale } from 'next-intl';
import { getLocalizedPath } from '../utils/getLocalizedPath';

function useLocalizedPath() {
  const currentLocale = useLocale();

  const localizedPath = (path: string) => getLocalizedPath(path, currentLocale);

  return {
    localizedPath,
  };
}

export default useLocalizedPath;
