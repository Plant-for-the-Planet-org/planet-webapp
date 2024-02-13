import styles from './AboutProject.module.scss';
import DownArrow from '../icons/DownArrow';
import { useState } from 'react';
import UpArrow from '../icons/UpArrow';
import { useTranslation } from 'next-i18next';

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
        {beginText}
        {itCanOverflow && (
          <span
            className={`${!isExpanded ? styles.hideText : styles.showText}`}
          >
            {endText}
          </span>
        )}
      </div>
      {itCanOverflow && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.readMoreLessButton}
        >
          {isExpanded ? (
            <>
              <div>{t('projectDetails:seeLess')}</div>
              <UpArrow />
            </>
          ) : (
            <>
              <div>{t('projectDetails:seeMore')}</div>
              <DownArrow />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AboutProject;
