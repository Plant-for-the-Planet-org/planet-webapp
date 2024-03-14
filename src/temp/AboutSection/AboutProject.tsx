import styles from './AboutProject.module.scss';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import SeeMoreLessButton from './SeeMoreLessButton';

interface Props {
  description: string;
  amountOfWords: number;
}

const AboutProject = ({ description, amountOfWords }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const splittedText = description.split(' ');

  const itCanOverflow = splittedText.length > amountOfWords;
  const beginText = itCanOverflow
    ? splittedText.slice(0, amountOfWords - 1).join(' ')
    : description;
  const endText = splittedText.slice(amountOfWords - 1).join(' ');
  const { t } = useTranslation(['projectDetails', 'donate']);

  return (
    <div className={styles.projectDescription}>
      <div className={styles.infoTitle}>{t('donate:aboutProject')}</div>
      <div className={styles.infoText}>
        {beginText}{' '}
        {itCanOverflow && (
          <span
            className={`${!isExpanded ? styles.hideText : styles.showText}`}
          >
            {endText}
          </span>
        )}
      </div>
      {itCanOverflow && (
        <SeeMoreLessButton
          isContainerExpanded={isExpanded}
          onClickFunction={() => setIsExpanded(!isExpanded)}
        />
      )}
    </div>
  );
};

export default AboutProject;
