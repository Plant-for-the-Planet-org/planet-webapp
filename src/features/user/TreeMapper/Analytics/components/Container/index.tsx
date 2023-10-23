import styles from './index.module.scss';

interface Props {
  leftElement: React.ReactElement;
  rightElement?: React.ReactElement;
  children: React.ReactElement;
  flexDirection?: 'row' | 'column';
  overrideBodyStyles?: string | null;
}

export const Container = ({
  leftElement,
  rightElement,
  children,
  flexDirection = 'row',
  overrideBodyStyles = null,
}: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={
          flexDirection === 'row'
            ? styles.headerFlexRow
            : styles.headerFlexColumn
        }
      >
        <div>{leftElement}</div>
        <div>{rightElement}</div>
      </div>
      <div className={overrideBodyStyles ? overrideBodyStyles : styles.body}>
        {children}
      </div>
    </div>
  );
};
