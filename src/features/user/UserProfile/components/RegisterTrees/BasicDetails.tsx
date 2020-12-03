import React, { ReactElement } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { Controller, useForm } from 'react-hook-form';
import styles from '../../styles/RegisterModal.module.scss';
import { postAuthenticatedRequest, putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import i18next from '../../../../../../i18n';
const { useTranslation } = i18next;

interface Props {
    lang: any;
    handleNext: Function;
    errorMessage: any;
    setErrorMessage: Function;
    contributionDetails: any;
    setContributionDetails: Function;
    isMultiple: Boolean;
    setIsMultiple: Function;
    contributionGUID: any;
    setContributionGUID: Function;
    geometry: any;
    token: any;
}

export default function BasicDetails({ lang, handleNext, errorMessage, setErrorMessage, contributionDetails, setContributionDetails, isMultiple, setIsMultiple, contributionGUID, setContributionGUID, token, geometry }: Props): ReactElement {

  const { t } = useTranslation(['registerTrees']);

    const [isUploadingData, setIsUploadingData] = React.useState(false);
    const defaultBasicDetails = {
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
    } = useForm({ mode: 'onBlur', defaultValues: defaultBasicDetails });

    const treeCount = watch('treeCount');

    const onTreeCountChange = (e) => {
        if (Number(e.target.value) === 1) {
            setIsMultiple(false);
        } else {
            setIsMultiple(true);
        }
    }

    const submitRegisterTrees = (data: any) => {
        if (geometry) {
            setIsUploadingData(true)
            const submitData = {
                treeCount: data.treeCount,
                species: data.name,
                plantDate: data.plantDate,
                geometry: geometry
            }
            postAuthenticatedRequest(`/app/contributions`, submitData, token).then(
                (res) => {
                    if (!res.code) {
                        console.log(res);
                        setErrorMessage('');
                        setContributionGUID(res.id);
                        setContributionDetails(res)
                        setIsUploadingData(false);
                        setErrorMessage(null);
                        handleNext();
                    } else {
                        if (res.code === 404) {
                            setIsUploadingData(false);
                            setErrorMessage(res.message);
                        } else {
                            setIsUploadingData(false);
                            setErrorMessage(res.message);
                        }
                    }
                }
            );

            // handleNext();
        } else {
            setErrorMessage(t('registerTrees:selectLocationMap'));
        }
    }

    return (
        <form onSubmit={handleSubmit(submitRegisterTrees)}>
            <div className={styles.formField}>
                <div className={styles.formFieldHalf}>
                    <MaterialTextField
                        inputRef={register({
                            required: {
                                value: true,
                                message: t('registerTrees:requiredNumberOfTrees'),
                            },
                            validate: (value) => parseInt(value, 10) >= 1 && parseInt(value, 10) <= 50,
                        })}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            e.target.value = e.target.value > 50 ? 50 : e.target.value;
                        }}
                        onChange={onTreeCountChange}
                        label={t('registerTrees:numberOfTrees')}
                        variant="outlined"
                        name="treeCount"
                        placeholder={'0'}
                    />
                    {errors.treeCount && (
                        <span className={styles.formErrors}>{errors.treeCount.message}</span>
                    )}
                </div>
                <div className={styles.formFieldHalf}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[lang] ? localeMapForDate[lang] : localeMapForDate['en']}>
                        <Controller
                            render={props => (

                                <DatePicker
                                    label={t('registerTrees:datePlanted')}
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
                            name="plantDate"
                            control={control}
                            defaultValue=""
                        />
                    </MuiPickersUtilsProvider>
                </div>
            </div>
            <div className={styles.formFieldLarge}>
                <MaterialTextField
                    inputRef={register({
                        required: {
                            value: true,
                            message:t('registerTrees:speciesRequired'),
                        },
                    })}
                    label={t('registerTrees:treeSpecies')}
                    variant="outlined"
                    name="species"
                />
                {errors.species && (
                    <span className={styles.formErrors}>{errors.species.message}</span>
                )}
            </div>
            {isMultiple ?
                <p> {t('registerTrees:drawPolygonMap')} </p>
                : <p> {t('registerTrees:clickMapMark')} </p>}
            {errorMessage ?
                <p className={styles.formErrors}>{errorMessage}</p> : null
            }
            <div className={styles.nextButton}>
                <div onClick={handleSubmit(submitRegisterTrees)} className={styles.continueButton}>  {isUploadingData ? (
                    <div className={styles.spinner}></div>
                ) : t('registerTrees:next')}</div>
            </div>

        </form>
    )
}
