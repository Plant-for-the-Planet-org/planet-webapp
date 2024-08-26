import React from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import RightArrowIcon from '../../../../../../public/assets/images/icons/projectV2/RightArrowIcon';

interface Props {
  contactInfo: {
    icon: React.JSX.Element;
    title: string | null;
    link: string | null;
  };
}

const SingleContactDetail = ({ contactInfo }: Props) => {
  return (
    <a
      href={contactInfo.link || undefined}
      target={contactInfo.title === 'View Profile' ? '_self' : '_blank'}
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
