import React from 'react';
import styles from './ProjectMapTabs.module.scss';

const SingleTab = ({ icon, title, isSelected }) => {
  return (
    <>
      <button
        style={{
          color: isSelected ? '#fff' : '#000',
          backgroundColor: isSelected ? '#219653' : '#fff',
          border: 'none',
        }}
        className={`${styles.option} ${styles.compact}`}
      >
        {icon}
        <p>{title}</p>
      </button>
    </>
  );
};

export default SingleTab;
