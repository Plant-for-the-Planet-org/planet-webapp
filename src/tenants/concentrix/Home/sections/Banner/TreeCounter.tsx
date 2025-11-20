import styles from './Banner.module.scss';

const TreeCounter = () => {
  const startingTreeCount = 1056078;
  const addedTreeCount = 0;
  const treeCount = startingTreeCount + addedTreeCount;

  // Format number with commas
  const formatNumber = (num: number) => {
    const numStr = num.toLocaleString('en-US');
    const parts = numStr.split(',');

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className={styles.comma}>,</span>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={styles.treeCounter}>
      <div className={styles.counterNumber}>{formatNumber(treeCount)}</div>
      <div className={styles.counterText}>
        of 2 Million trees until 2030 planted
      </div>
    </div>
  );
};

export default TreeCounter;
