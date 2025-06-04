import React, { useMemo } from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import RightArrowIcon from '../../../../../../public/assets/images/icons/projectV2/RightArrowIcon';

interface Props {
  contactInfo: {
    icon: React.JSX.Element;
    title: string | null;
    link: string | null;
    shouldOpenNewTab: boolean;
    isExternalLink?: boolean;
  };
}

const SingleContactDetail = ({ contactInfo }: Props) => {
  const { link, shouldOpenNewTab, icon, title, isExternalLink } = contactInfo;

  const processedLink = useMemo(() => {
    if (!link) return undefined;

    if (isExternalLink) {
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return `https://${link}`;
      }
    }
    return link;
  }, [link, isExternalLink]);

  return (
    <a
      href={processedLink || undefined}
      target={shouldOpenNewTab ? '_blank' : '_self'}
      rel="noreferrer"
      className={styles.singleContact}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.rightArrow}>
        <RightArrowIcon width={5} color={`${'var(--primary-font-color)'}`} />
      </div>
    </a>
  );
};

export default SingleContactDetail;
