import type { ReactNode } from 'react';

import styles from './ProjectMapTabs.module.scss';
import { clsx } from 'clsx';

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
      className={clsx(styles.singleTabOption, {
        [styles.selected]: isSelected,
      })}
      onClick={onClickHandler}
    >
      {icon}
      <p>{title}</p>
    </button>
  );
};

export default SingleTab;
