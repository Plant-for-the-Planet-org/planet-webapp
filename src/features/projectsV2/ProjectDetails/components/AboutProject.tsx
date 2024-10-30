import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/AboutProject.module.scss';
import DownArrow from '../../../../../public/assets/images/icons/projectV2/DownArrow';
import UpArrow from '../../../../../public/assets/images/icons/projectV2/UpArrow';

interface Props {
  description: string;
  wordCount?: number;
}

const AboutProject = ({ description, wordCount = 60 }: Props) => {
  const tDonate = useTranslations('Donate');
  const tProjectDetails = useTranslations('ProjectDetails');
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionWords = description?.split(' ');
  const hasOverflow = descriptionWords?.length > wordCount;
  const startingText = hasOverflow
    ? descriptionWords?.slice(0, wordCount - 1).join(' ')
    : description;
  const endText = descriptionWords?.slice(wordCount - 1).join(' ');
  return (
    <div className={styles.projectDescription}>
      <div className={styles.infoTitle}>{tDonate('aboutProject')}</div>
      <div className={styles.infoText}>
        {startingText} {hasOverflow && !isExpanded && <span>...</span>}
        {hasOverflow && (
          <span
            className={`${!isExpanded ? styles.hideText : styles.showText}`}
          >
            {endText}
          </span>
        )}
      </div>
      {hasOverflow && (
        <button onClick={() => setIsExpanded(!isExpanded)}>
          <div>
            {isExpanded
              ? tProjectDetails('readLess')
              : tProjectDetails('readMore')}
          </div>
          <div>
            {isExpanded ? <UpArrow width={7} /> : <DownArrow width={7} />}
          </div>
        </button>
      )}
    </div>
  );
};

export default AboutProject;
