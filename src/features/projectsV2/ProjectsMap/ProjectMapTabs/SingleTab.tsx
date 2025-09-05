import type { ReactNode } from 'react';

import styles from './ProjectMapTabs.module.scss';

interface SingleTabProps {
  icon: ReactNode;
  title: string;
  isSelected: boolean;
  onClickHandler: () => void;
}

const SingleTab = ({
  icon,
  title,
  isSelected,
  onClickHandler,
}: SingleTabProps) => {
  return (
    <button
      className={`${styles.singleTabOption} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={onClickHandler}
    >
      {icon}
      <p>{title}</p>
    </button>
  );
};

export default SingleTab;
