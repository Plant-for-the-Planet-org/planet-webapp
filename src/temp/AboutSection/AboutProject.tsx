import styles from './AboutProject.module.scss';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation(['projectDetails', 'donate']);

  return (
    <div className={styles.projectDescription}>
      <div className={styles.infoTitle}>{t('donate:aboutProject')}</div>
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
