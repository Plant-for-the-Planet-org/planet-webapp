import styles from '../styles/AboutProject.module.scss';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DownArrow from '../../../../temp/icons/DownArrow';
import UpArrow from '../../../../temp/icons/UpArrow';

interface Props {
  description: string | null;
  wordCount: number | undefined;
}

const AboutProject = ({ description, wordCount }: Props) => {
  const tDonate = useTranslations('Donate');
  const tProjectDetails = useTranslations('ProjectDetails');
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionWords = description?.split(' ');
  const hasOverflow =
    descriptionWords && wordCount && descriptionWords?.length > wordCount;
  const startingText =
    hasOverflow && wordCount
      ? descriptionWords?.slice(0, wordCount - 1).join(' ')
      : description;
  const endText = wordCount && descriptionWords?.slice(wordCount - 1).join(' ');
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
