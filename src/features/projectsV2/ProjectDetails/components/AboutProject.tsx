import styles from '../styles/AboutProject.module.scss';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToggleDescriptionButton from './microComponents/ToggleDescriptionButton';

interface Props {
  description: string | null;
  wordCount: number | undefined;
}

const AboutProject = ({ description, wordCount }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionWords = description?.split(' ');
  const hasOverflow =
    descriptionWords && wordCount && descriptionWords?.length > wordCount;

  const startingText =
    hasOverflow && wordCount
      ? descriptionWords?.slice(0, wordCount - 1).join(' ')
      : description;
  const endText = wordCount && descriptionWords?.slice(wordCount - 1).join(' ');
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
