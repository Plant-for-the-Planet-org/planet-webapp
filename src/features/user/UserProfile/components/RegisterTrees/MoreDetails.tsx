import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../../../common/InputTypes/ToggleSwitch';
import styles from '../../styles/RegisterModal.module.scss';

interface Props {
}

export default function MoreDetails({ }: Props): ReactElement {

    const [isUploadingData, setIsUploadingData] = React.useState(false);
    const defaultMoreDetails = {
        treeCount: 0,
        species: '',
        plantDate: new Date(),
        geometry: {}
    }

    const {
        register,
        handleSubmit,
        errors,
        control,
        reset,
        setValue,
        watch,
    } = useForm({ mode: 'onBlur', defaultValues: defaultMoreDetails });

    const onSubmit = (data: any) => {
        console.log('submitted');
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formField}>
                <div className={styles.formFieldHalf}>
                    <MaterialTextField
                        label="Tree Classification"
                        variant="outlined"
                    />
                </div>
                <div className={styles.formFieldHalf}>
                    <MaterialTextField
                        label="Tree Scientific Name"
                        variant="outlined"
                    />
                </div>
            </div>
            <div className={styles.formFieldLarge}>
                <div className={styles.continueButton}>Submit</div>
            </div>
        </form>
    )
}
