import React from 'react';
import styles from './ProjectInfo.module.scss';
import RightArrowIcon from '../icons/RightArrowIcon';

interface Props {
  contactInfo: { icon: React.JSX.Element; title: string; link: string };
}

const SingleContactDetail = ({ contactInfo }: Props) => {
  return (
    <a
      href={contactInfo.link}
      target="_blank"
      rel="noreferrer"
      className={styles.singleContact}
    >
      <div className={styles.icon}>{contactInfo.icon}</div>
      <div className={styles.title}>{contactInfo.title}</div>
      <div className={styles.rightArrow}>
        <RightArrowIcon width={5} color={`${'var(--primary-font-color)'}`} />
      </div>
    </a>
  );
};

export default SingleContactDetail;
