import { useLocale } from 'next-intl';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useCallback } from 'react';

function useLocalizedPath() {
  const currentLocale = useLocale();

  const localizedPath = useCallback(
    (path: string) => getLocalizedPath(path, currentLocale),
    [currentLocale]
  );

  return {
    localizedPath,
  };
}

export default useLocalizedPath;
