import styles from './Banner.module.scss';

interface Props {
  totalTrees: number;
}

const TreeCounter = ({ totalTrees }: Props) => {
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
      <div className={styles.counterNumber}>{formatNumber(totalTrees)}</div>
      <div className={styles.counterText}>
        trees planted of our 2 Million by 2030 Goal
      </div>
    </div>
  );
};

export default TreeCounter;
