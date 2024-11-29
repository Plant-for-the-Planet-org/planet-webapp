import type { JSX } from 'react';
import styles from '../AddressManagement.module.scss';

interface Props {
  children: JSX.Element;
  label: string;
}
const AddressFormLayout = ({ children, label }: Props) => {
  return (
    <div className={styles.addressFormContainer}>
      <h2>{label}</h2>
      {children}
    </div>
  );
};

export default AddressFormLayout;
