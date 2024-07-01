import styles from './AboutProject.module.scss';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToggleDescriptionButton from './ToggleDescriptionButton';

interface Props {
  description: string;
  wordCount: number;
}

const AboutProject = ({ description, wordCount }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionWords = description.split(' ');

  const hasOverflow = descriptionWords.length > wordCount;
  const startingText = hasOverflow
    ? descriptionWords.slice(0, wordCount - 1).join(' ')
    : description;
  const endText = descriptionWords.slice(wordCount - 1).join(' ');
  const tDonate = useTranslations('Donate');

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
        <ToggleDescriptionButton
          isContainerExpanded={isExpanded}
          onClickFunction={() => setIsExpanded(!isExpanded)}
        />
      )}
    </div>
  );
};

export default AboutProject;
