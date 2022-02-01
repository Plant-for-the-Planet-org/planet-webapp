import React, { ReactElement } from 'react';
import styles from '../Import.module.scss';
import i18next from '../../../../../../i18n';

const { useTranslation } = i18next;

interface Props {
    handleNext: Function;
    errorMessage: String;
    setErrorMessage: Function;
    plantLocation: Treemapper.PlantLocation;
}

export default function ReviewSubmit({ handleNext, errorMessage, setErrorMessage, plantLocation }: Props): ReactElement {
    const { t, ready } = useTranslation(['treemapper', 'common']);
    console.log(`plantLocation`, plantLocation)
    return (
        <div className={styles.stepWrapper}>
            <div className={styles.stepTitle}>{t('summary')}</div>
            <div className={styles.stepDescription}>
                {t('reviewSubmitDescription')}
            </div>
            <div className={styles.stepContent}>
                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <div className={styles.gridItemTitle}>
                            {t('hid')}
                        </div>
                        <div className={styles.gridItemValue}>
                            {plantLocation.hid}
                        </div>
                    </div>
                    <div className={styles.gridItem}>
                        <div className={styles.gridItemTitle}>
                            {t('captureMode')}
                        </div>
                        <div className={styles.gridItemValue}>
                            {plantLocation.captureMode}
                        </div>
                    </div>
                    <div className={styles.gridItem}>
                        <div className={styles.gridItemTitle}>
                            {t('plantDate')}
                        </div>
                        <div className={styles.gridItemValue}>
                            {plantLocation.plantDate}
                        </div>
                    </div>
                    <div className={styles.gridItem}>
                        <div className={styles.gridItemTitle}>
                            {t('registrationDate')}
                        </div>
                        <div className={styles.gridItemValue}>
                            {plantLocation.registrationDate}
                        </div>
                    </div>
                    <div className={styles.gridItem}>
                        <div className={styles.gridItemTitle}>
                            {t('captureMode')}
                        </div>
                        <div className={styles.gridItemValue}>
                            {plantLocation.captureMode}
                        </div>
                    </div>
                    <div className={styles.gridItem}>
                        <div className={styles.gridItemTitle}>
                            {t('captureStatus')}
                        </div>
                        <div className={styles.gridItemValue}>
                            {plantLocation.captureStatus}
                        </div>
                    </div>
                </div>
                <p className={styles.gridItemTitle}>{t('species')}</p>
                <div className={styles.gridItemValue}>
                    <span>
                        {plantLocation.plantedSpecies.map((species: any) => {
                            return (
                                <p key={species.id}>
                                    {species.treeCount}{' '}
                                    {species.scientificName
                                        ? species.scientificName
                                        : species.otherSpecies && species.otherSpecies !== 'Unknown'
                                            ? species.otherSpecies :
                                            t('maps:unknown')}
                                </p>
                            );
                        })}
                    </span>
                </div>
                {plantLocation.type === 'multi' && plantLocation.captureMode === 'on-site' && (
                    <>
                        <p className={styles.gridItemTitle}>{t('maps:sampleTree')}</p>
                        <div className={styles.gridItemValue}>
                            {plantLocation.samplePlantLocations &&
                                plantLocation.samplePlantLocations.map((spl: any, index: number) => {
                                    return (
                                        <div key={index} className={styles.value}>
                                            {index + 1}.{' '}
                                            <span
                                                //   onClick={() => setselectedLocation(spl)}
                                                className={styles.link}
                                            >
                                                {spl.scientificName
                                                    ? spl.scientificName
                                                    : spl.scientificSpecies && spl.scientificSpecies !== 'Unknown'
                                                        ? spl.scientificSpecies
                                                        : t('maps:unknown')}
                                            </span>
                                            <br />
                                            {spl.tag ? `${t('maps:tag')} #${spl.tag} • ` : null}
                                            {spl?.measurements?.height}
                                            {t('maps:meterHigh')} • {spl?.measurements?.width}
                                            {t('maps:cmWide')}
                                        </div>
                                    );
                                })}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
