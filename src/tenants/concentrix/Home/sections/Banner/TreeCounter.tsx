import styles from './Banner.module.scss';

interface Props {
  addedTreeCount: number;
}

const TreeCounter = ({ addedTreeCount }: Props) => {
  const startingTreeCount = 1056078;
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
