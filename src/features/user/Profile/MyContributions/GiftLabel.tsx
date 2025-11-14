import type {
  GiftReceivedDetails,
  GiftGivenDetails,
} from '../../../common/types/myForest';

import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';
import GiftIcon from '../../../../../public/assets/images/icons/Gift';

type Props = {
  giftDetails: GiftGivenDetails | GiftReceivedDetails;
};

const GiftLabel = ({ giftDetails }: Props) => {
  const t = useTranslations('Profile');

  const giftLabelText =
    'recipientName' in giftDetails
      ? t('myContributions.giftGivenInfo', {
          name: giftDetails.recipientName || t('myContributions.anonymousUser'),
        })
      : t('myContributions.giftReceivedInfo', {
          name: giftDetails.giverName || t('myContributions.anonymousUser'),
        });

  return (
    <div className={styles.giftLabel} title={giftLabelText}>
      <div className={styles.giftLabelInner}>
        <div className={styles.giftIconContainer}>
          <GiftIcon />
        </div>
        <span className={styles.giftLabelText}>{giftLabelText}</span>
      </div>
    </div>
  );
};

export default GiftLabel;
