import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';
import GiftIcon from '../../../../../public/assets/images/icons/Gift';

type GiftReceivedProps = {
  giftDirection: 'received';
  giftGiver?: string;
};

type GiftGivenProps = {
  giftDirection: 'given';
  giftReceiver?: string;
};

type GiftLabelProps = GiftReceivedProps | GiftGivenProps;

const GiftLabel = (props: GiftLabelProps) => {
  const t = useTranslations('Profile');
  const { giftDirection } = props;

  return (
    <div className={styles.giftLabel}>
      <div className={styles.giftIconContainer}>
        <GiftIcon />
      </div>
      {giftDirection === 'received'
        ? t('myContributions.giftReceivedInfo', {
            name: props.giftGiver || t('myContributions.anonymousUser'),
          })
        : t('myContributions.giftGivenInfo', {
            name: props.giftReceiver || t('myContributions.anonymousUser'),
          })}
    </div>
  );
};

export default GiftLabel;
