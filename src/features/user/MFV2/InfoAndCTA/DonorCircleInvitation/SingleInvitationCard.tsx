import React from 'react';
import styles from '../InfoAndCta.module.scss';

interface Props {
  link: string;
  image: string;
  title: string;
  subtext: string;
}

const PublicProfileActionCard = ({ link, image, title, subtext }: Props) => {
  return (
    <a
      className={styles.singleProfileActionCardContainer}
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      <img src={image} alt={title} />
      <h3 className={styles.singleProfileActionCardTitle}>{title}</h3>
      <p className={styles.singleProfileActionCardText}>{subtext}</p>
    </a>
  );
};

export default PublicProfileActionCard;
