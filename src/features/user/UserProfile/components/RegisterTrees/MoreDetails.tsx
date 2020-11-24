import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../../../common/InputTypes/ToggleSwitch';
import styles from '../../styles/RegisterModal.module.scss';

interface Props {
}

export default function MoreDetails({ }: Props): ReactElement {
    const {
        register,
        handleSubmit,
        errors,
        control,
        reset,
        setValue,
        watch,
    } = useForm({ mode: 'onBlur' });

    const onSubmit = (data: any) => {
        console.log('submitted');
    }

    const classification = watch('classification');
    const mesurements = watch('mesurements');
    return (
        <>
            <div className={styles.formField}>
                <div className={`${styles.formFieldHalf}`}>
                    <div className={`${styles.formFieldRadio}`}>
                        <label
                            htmlFor="classification"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            Classification
        <div
                                style={{ height: '13px', width: '13px', marginLeft: '6px' }}
                            >
                                {/* <div className={styles.popover}>
            <InfoIcon />
            <div
              className={styles.popoverContent}
              style={{ left: '-150px' }}
            >
              <p>
                Classification
              </p>
            </div>
          </div> */}
                            </div>
                        </label>

                        <Controller
                            name="classification"
                            control={control}
                            render={(props) => (
                                <ToggleSwitch
                                    id="classification"
                                    checked={props.value}
                                    onChange={(e) => props.onChange(e.target.checked)}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            {classification ? (
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            placeholder="20 Nov 2020"
                            label="Tree Classification"
                            variant="outlined"
                        />
                    </div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            placeholder="20 Nov 2020"
                            label="Tree Scientific Name"
                            variant="outlined"
                        />
                    </div>
                </div>
            ) : null}

            <div className={styles.formField}>
                <div className={`${styles.formFieldHalf}`}>
                    <div className={`${styles.formFieldRadio}`}>
                        <label
                            htmlFor="mesurements"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            Mesurements
        <div
                                style={{ height: '13px', width: '13px', marginLeft: '6px' }}
                            >
                            </div>
                        </label>

                        <Controller
                            name="mesurements"
                            control={control}
                            render={(props) => (
                                <ToggleSwitch
                                    id="mesurements"
                                    checked={props.value}
                                    onChange={(e) => props.onChange(e.target.checked)}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            {mesurements ? (
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            placeholder="20 Nov 2020"
                            label="Diameter"
                            variant="outlined"
                        />
                    </div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            placeholder="20 Nov 2020"
                            label="Height"
                            variant="outlined"
                        />
                    </div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            placeholder="20 Nov 2020"
                            label="Mesurement Date"
                            variant="outlined"
                        />
                    </div>
                </div>
            ) : null}
            <div className={styles.formFieldLarge}>
                <div className={styles.continueButton}>Submit</div>
            </div>
        </>
    )
}
