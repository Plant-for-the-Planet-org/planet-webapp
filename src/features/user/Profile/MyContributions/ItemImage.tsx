import type {
  GiftGivenDetails,
  GiftReceivedDetails,
} from '../../../common/types/myForest';

import GiftLabel from './GiftLabel';
import styles from './MyContributions.module.scss';

interface Props {
  imageUrl?: string;
  giftDetails?: GiftGivenDetails | GiftReceivedDetails;
}

const ItemImage = ({ imageUrl, giftDetails }: Props) => {
  return (
    <div
      className={`${styles.itemImageContainer} ${
        !giftDetails ? styles.roundedCorners : ''
      }`}
      style={
        imageUrl
          ? {
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }
          : undefined
      }
    >
      {giftDetails !== undefined && <GiftLabel giftDetails={giftDetails} />}
    </div>
  );
};

export default ItemImage;
