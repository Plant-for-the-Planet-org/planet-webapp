import React from 'react';
import DownArrow from '../../../../../temp/icons/DownArrow';
import UpArrow from '../../../../../temp/icons/UpArrow';
import styles from '../../styles/ToggleDescriptionButton.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  isContainerExpanded: boolean;
  onClickFunction: () => void;
}

const ToggleDescriptionButton = ({
  isContainerExpanded,
  onClickFunction,
}: Props) => {
  const t = useTranslations('ProjectDetails');
  return (
    <button onClick={onClickFunction} className={styles.readMoreLessButton}>
      {isContainerExpanded ? (
        <>
          <div>{t('seeLess')}</div>
          <UpArrow width={7} />
        </>
      ) : (
        <>
          <div>{t('seeMore')}</div>
          <DownArrow width={7} />
        </>
      )}
    </button>
  );
};

export default ToggleDescriptionButton;
