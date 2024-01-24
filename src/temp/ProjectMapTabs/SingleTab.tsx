import React from 'react';
import styles from './ProjectMapTabs.module.scss';

interface SingleTabProps {
  icon: React.JSX.Element;
  title: string;
  isSelected: boolean;
}

const SingleTab = ({ icon, title, isSelected }: SingleTabProps) => {
  return (
    <>
      <button
        className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      >
        {icon}
        <p>{title}</p>
      </button>
    </>
  );
};

export default SingleTab;
