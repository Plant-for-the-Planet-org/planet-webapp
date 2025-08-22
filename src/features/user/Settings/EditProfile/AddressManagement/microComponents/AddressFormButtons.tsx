import styles from '../AddressManagement.module.scss';
import WebappButton from '../../../../../common/WebappButton';
import { useTranslations } from 'next-intl';

interface Props {
  text: string;
  handleSubmit: () => void;
  handleCancel: () => void;
}

const AddressFormButtons = ({ text, handleSubmit, handleCancel }: Props) => {
  const tCommon = useTranslations('Common');
  return (
    <div className={styles.buttonContainer}>
      <WebappButton
        text={tCommon('cancel')}
        variant="secondary"
        elementType="button"
        onClick={handleCancel}
      />
      <WebappButton
        text={text}
        variant="primary"
        elementType="button"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default AddressFormButtons;
