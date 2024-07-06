import styles from './index.module.scss';

/**
 * Props interface for the Container component.
 */
interface Props {
  /** The element to be placed on the left side of the container. */
  leftElement: React.ReactElement;
  /** The element to be placed on the right side of the container. */
  rightElement?: React.ReactElement;
  /** The main content of the container. */
  children: React.ReactElement;
  /**
   * The direction of the flex container. Can be either 'row' (horizontal) or 'column' (vertical).
   * @default 'row'
   */
  flexDirection?: 'row' | 'column';
  /** Override styles for the body of the container. */
  overrideBodyStyles?: string | null;
}

/**
 * Container component that wraps content with optional left and right elements.
 * @param props The props for the Container component.
 * @returns A Container component.
 */
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
