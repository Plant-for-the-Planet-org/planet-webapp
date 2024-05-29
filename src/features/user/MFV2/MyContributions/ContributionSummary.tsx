import { useTranslations } from 'next-intl';
import GiftIcon from '../../../../../public/assets/images/icons/Gift';
import { MySingleContribution } from '../../../common/types/myForestv2';
import styles from './MyContributions.module.scss';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';

interface Props {
  contribution: MySingleContribution;
  purpose: 'trees' | 'conservation';
}

const ContributionSummary = ({ contribution, purpose }: Props) => {
  const t = useTranslations('Profile');

  const showGiftIcon =
    contribution.dataType === 'receivedGift' || contribution.isGifted;

  const contributedUnits =
    contribution.unitType === 'tree'
      ? t('myContributions.treesContributed', { count: contribution.quantity })
      : t('myContributions.areaContributed', {
          count: contribution.quantity,
          projectPurpose: purpose,
        });

  const contributionDate = format(new Date(contribution.plantDate), 'PP', {
    locale: localeMapForDate[localStorage.getItem('language') || 'en'],
  });

  return (
    <div className={styles.contributionSummary}>
      <div className={styles.contributionDetails}>
        {showGiftIcon && (
          <div className={styles.giftIconContainer}>
            <GiftIcon />
          </div>
        )}
        <div className={styles.contributedUnits}>{contributedUnits}</div>
      </div>
      <time dateTime={contributionDate} className={styles.contributionDate}>
        {contributionDate}
      </time>
    </div>
  );
};

export default ContributionSummary;
