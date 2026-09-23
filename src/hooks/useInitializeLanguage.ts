import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export const useInitializeLanguage = () => {
  const locale = useLocale();

  useEffect(() => {
    if (localStorage.getItem('language') !== locale) {
      localStorage.setItem('language', locale);
    }
  }, [locale]);
};
