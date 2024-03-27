import React from 'react';
import DownArrow from '../icons/DownArrow';
import UpArrow from '../icons/UpArrow';
import styles from './SeeMoreLess.module.scss';
import { useTranslation } from 'next-i18next';

interface Props {
  isContainerExpanded: boolean;
  onClickFunction: () => void;
}

const SeeMoreLessButton = ({ isContainerExpanded, onClickFunction }: Props) => {
  const { t } = useTranslation('projectDetails');
  return (
    <button onClick={onClickFunction} className={styles.readMoreLessButton}>
      {isContainerExpanded ? (
        <>
          <div>{t('projectDetails:seeLess')}</div>
          <UpArrow width={7} />
        </>
      ) : (
        <>
          <div>{t('projectDetails:seeMore')}</div>
          <DownArrow width={7} />
        </>
      )}
    </button>
  );
};

export default SeeMoreLessButton;
