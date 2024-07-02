import React from 'react';
import styles from '../InfoAndCta.module.scss';

interface Props {
  link: string;
  image: string;
  title: string;
  subtext: string;
}

const SingleInvitationCard = ({ link, image, title, subtext }: Props) => {
  return (
    <a
      className={styles.singleInvitationCardContainer}
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      <img src={image} alt={title} />
      <h3 className={styles.singleInvitationCardTitle}>{title}</h3>
      <p className={styles.singleInvitationCardText}>{subtext}</p>
    </a>
  );
};

export default SingleInvitationCard;
