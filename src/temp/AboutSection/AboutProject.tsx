import styles from './AboutProject.module.scss';
import DownArrow from '../icons/DownArrow';
import { useState } from 'react';
import UpArrow from '../icons/UpArrow';

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

  return (
    <div className={styles.projectDescription}>
      <div className={styles.infoTitle}>About Project</div>
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
              <div>see less</div>
              <UpArrow />
            </>
          ) : (
            <>
              <div>see more</div>
              <DownArrow />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AboutProject;
