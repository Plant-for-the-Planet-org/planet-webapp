import { useTranslations } from 'next-intl';
import GiftIcon from '../../../../../public/assets/images/icons/Gift';
import { MySingleContribution } from '../../../common/types/myForest';
import styles from './MyContributions.module.scss';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { forwardRef, useMemo } from 'react';
import GiftInfoTooltip from './GiftInfoTooltip';

interface Props {
  contribution: MySingleContribution;
  purpose: 'trees' | 'conservation';
}

const UnwrappedContributionSummary = forwardRef<HTMLDivElement, Props>(
  ({ contribution, purpose }: Props, ref) => {
    const t = useTranslations('Profile');

    const showGiftIcon =
      contribution.dataType === 'receivedGift' || contribution.isGifted;

    const contributedUnits =
      contribution.unitType === 'tree'
        ? t('myContributions.treesContributed', {
            count: contribution.quantity,
          })
        : t('myContributions.areaContributed', {
            count: contribution.quantity,
            projectPurpose: purpose,
          });

    const contributionDate = format(new Date(contribution.plantDate), 'PP', {
      locale: localeMapForDate[localStorage.getItem('language') || 'en'],
    });

    return (
      <div className={styles.contributionSummary} ref={ref}>
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
  }
);

const ContributionSummary = ({ contribution, purpose }: Props) => {
  const t = useTranslations('Profile');

  const giftInfo = useMemo(() => {
    const { dataType, giftDetails } = contribution;
    if (dataType === 'receivedGift')
      return t('myContributions.giftReceivedInfo', {
        name: giftDetails.giverName || t('myContributions.anonymousUser'),
      });
    if (dataType === 'donation' && giftDetails !== null)
      return t('myContributions.giftGivenInfo', {
        name: giftDetails.recipient || t('myContributions.anonymousUser'),
      });
  }, [contribution, t]);

  const shouldWrapInTooltip =
    contribution.dataType === 'receivedGift' || contribution.isGifted;
  const tooltipContent = !shouldWrapInTooltip ? undefined : giftInfo;

  return shouldWrapInTooltip && giftInfo ? (
    <GiftInfoTooltip
      title={tooltipContent}
      disableFocusListener
      placement="bottom-end"
    >
      <div className={styles.tooltip}>
        <UnwrappedContributionSummary
          contribution={contribution}
          purpose={purpose}
        />
      </div>
    </GiftInfoTooltip>
  ) : (
    <UnwrappedContributionSummary
      contribution={contribution}
      purpose={purpose}
    />
  );
};

export default ContributionSummary;
