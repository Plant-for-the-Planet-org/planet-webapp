import styles from './MyContributions.module.scss';

interface Props {
  imageUrl: string;
  imageAlt: string;
}

const ItemImage = ({ imageUrl, imageAlt }: Props) => {
  return (
    <div className={styles.itemImageContainer}>
      <img src={imageUrl} alt={imageAlt} className={styles.itemImage} />
    </div>
  );
};

export default ItemImage;
