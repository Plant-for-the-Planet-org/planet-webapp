import styles from './index.module.scss';

interface Props {
  title: string;
  options?: React.ReactElement;
  children: React.ReactElement;
  flexDirection?: 'row' | 'column';
}

export const Container = ({
  title,
  options,
  children,
  flexDirection = 'row',
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
        <p className={styles.title}>{title}</p>
        <div>{options}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
