import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';
import GiftIcon from '../../../../../public/assets/images/icons/Gift';
import {
  GiftReceivedDetails,
  GiftGivenDetails,
} from '../../../common/types/myForestv2';

type Props = {
  giftDetails: GiftGivenDetails | GiftReceivedDetails;
};

const GiftLabel = ({ giftDetails }: Props) => {
  const t = useTranslations('Profile');

  return (
    <div className={styles.giftLabel}>
      <div className={styles.giftIconContainer}>
        <GiftIcon />
      </div>
      {'recipient' in giftDetails
        ? t('myContributions.giftReceivedInfo', {
            name: giftDetails.recipient || t('myContributions.anonymousUser'),
          })
        : t('myContributions.giftGivenInfo', {
            name: giftDetails.giverName || t('myContributions.anonymousUser'),
          })}
    </div>
  );
};

export default GiftLabel;
