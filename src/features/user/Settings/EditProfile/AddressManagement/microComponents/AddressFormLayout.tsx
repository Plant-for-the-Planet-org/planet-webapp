import type { JSX } from 'react';
import styles from '../AddressManagement.module.scss';

interface Props {
  children: JSX.Element;
  label: string;
}
const AddressFormLayout = ({ children, label }: Props) => {
  return (
    <div className={styles.addressFormLayout}>
      <h2 className={styles.header}>{label}</h2>
      {children}
    </div>
  );
};

export default AddressFormLayout;
