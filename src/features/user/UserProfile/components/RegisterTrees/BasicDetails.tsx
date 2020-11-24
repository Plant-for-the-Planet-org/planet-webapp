import React, { ReactElement } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { Controller, useForm } from 'react-hook-form';
import styles from '../../styles/RegisterModal.module.scss';

interface Props {
    lang: any;
    handleNext: Function;
}

export default function BasicDetails({ lang, handleNext }: Props): ReactElement {
    const {
        register,
        handleSubmit,
        errors,
        control,
        reset,
        setValue,
        watch,
    } = useForm({ mode: 'onBlur' });
    return (
        <div className={styles.formField}>
            <div className={styles.formFieldHalf}>
                <MaterialTextField
                    placeholder="50"
                    label="Number of Trees"
                    variant="outlined"
                />
            </div>
            <div className={styles.formFieldHalf}>
                <MaterialTextField
                    placeholder="Mangifera indica"
                    label="Name of Tree"
                    variant="outlined"
                />
            </div>
            <div className={styles.formFieldHalf}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[lang] ? localeMapForDate[lang] : localeMapForDate['en']}>
                    <Controller
                        render={props => (

                            <DatePicker
                                label="Date Planted"
                                value={props.value}
                                onChange={props.onChange}
                                inputVariant="outlined"
                                TextFieldComponent={MaterialTextField}
                                autoOk
                                disableFuture
                                minDate={new Date(new Date().setFullYear(1950))}
                                format="dd MMMM yyyy"
                                maxDate={new Date()}
                            />)
                        }
                        name="data-planted"
                        control={control}
                        defaultValue=""
                    />
                </MuiPickersUtilsProvider>
            </div>
            <p>Click on the map to mark a location</p>
            <div className={styles.nextButton}>
                <div onClick={handleNext} className={styles.continueButton}>Next</div>
            </div>
        </div>
    )
}
