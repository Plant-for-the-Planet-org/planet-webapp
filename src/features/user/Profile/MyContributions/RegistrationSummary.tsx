import type { CountryCode } from '@planet-sdk/common';
import type { DateString } from '../../../common/types/common';

import styles from './MyContributions.module.scss';
import { useTranslations } from 'next-intl';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import format from 'date-fns/format';

interface Props {
  treeCount: number;
  country: CountryCode | null;
  registrationDate: DateString;
}

const RegistrationSummary = ({
  treeCount,
  country,
  registrationDate,
}: Props) => {
  const t = useTranslations('Profile');
  const tCountry = useTranslations('Country');

  const formattedRegDate = format(new Date(registrationDate), 'PP', {
    locale: localeMapForDate[localStorage.getItem('language') || 'en'],
  });

  return (
    <div className={styles.registrationSummary}>
      <div className={styles.registeredTreeCount}>
        {t('myContributions.treesRegisteredHeadline', { count: treeCount })}
      </div>
      <div className={styles.registrationInfo}>
        {country
          ? t('myContributions.registrationInfoWithCountry', {
              countryName: tCountry(
                country.toLowerCase() as Lowercase<CountryCode>
              ),
              date: formattedRegDate,
            })
          : t('myContributions.registrationInfo', {
              date: formattedRegDate,
            })}
      </div>
    </div>
  );
};

export default RegistrationSummary;
