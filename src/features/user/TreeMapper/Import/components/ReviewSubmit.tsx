import type { ReactElement } from 'react';
import type { MultiTreeRegistration } from '../../../../common/types/intervention';

import React from 'react';
import styles from '../Import.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';

interface Props {
  intervention: MultiTreeRegistration;
  handleBack: () => void;
}

export default function ReviewSubmit({
  intervention,
  handleBack,
}: Props): ReactElement {
  const router = useRouter();
  const tTreemapper = useTranslations('Treemapper');
  const tMaps = useTranslations('Maps');
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(true);

  const handleSubmit = () => {
    setIsUploadingData(true);
    setSubmitted(true);
    setIsUploadingData(false);
  };

  return (
    <div className={styles.stepWrapper}>
      {submitted ? (
        <>
          <div className={styles.successContainer}>
            <h2>{tTreemapper('submittedSuccess')}</h2>
            <p>{tTreemapper('submittedSuccessDescription')}</p>
            <Button
              onClick={() => router.push('/profile/treemapper')}
              variant="contained"
              color="primary"
            >
              {tTreemapper('myPlantLocations')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.stepTitle}>{tTreemapper('summary')}</div>
          <div className={styles.stepDescription}>
            {tTreemapper('reviewSubmitDescription')}
          </div>
          {intervention ? (
            <div className={styles.stepContent}>
              <div className={styles.grid}>
                <div className={styles.gridItem}>
                  <div className={styles.gridItemTitle}>
                    {tTreemapper('captureMode')}
                  </div>
                  <div className={styles.gridItemValue}>
                    {intervention.captureMode}
                  </div>
                </div>
                <div className={styles.gridItem}>
                  <div className={styles.gridItemTitle}>
                    {tTreemapper('plantDate')}
                  </div>
                  <div className={styles.gridItemValue}>
                    {formatDate(intervention.plantDate)}
                  </div>
                </div>
                <div className={styles.gridItem}>
                  <div className={styles.gridItemTitle}>
                    {tTreemapper('registrationDate')}
                  </div>
                  <div className={styles.gridItemValue}>
                    {formatDate(intervention.registrationDate)}
                  </div>
                </div>
              </div>
              <p className={styles.gridItemTitle}>{tTreemapper('species')}</p>
              <div className={styles.gridItemValue}>
                <span>
                  {intervention.plantedSpecies
                    ? intervention.plantedSpecies.map((species) => {
                        return (
                          <p key={species.id}>
                            {species.treeCount}{' '}
                            {species.scientificName
                              ? species.scientificName
                              : species.otherSpecies &&
                                species.otherSpecies !== 'Unknown'
                              ? species.otherSpecies
                              : tMaps('unknown')}
                          </p>
                        );
                      })
                    : []}
                </span>
              </div>
              {intervention.type === 'multi-tree-registration' &&
              intervention.captureMode === 'external' ? (
                <>
                  <p className={styles.gridItemTitle}>
                    {tTreemapper('sampleTrees')}
                  </p>
                  <div className={styles.gridItemValue}>
                    {intervention.sampleInterventions &&
                      intervention.sampleInterventions.map((spl, index) => {
                        return (
                          <div key={index} className={styles.value}>
                            {index + 1}.{' '}
                            <span className={styles.link}>
                              {'otherSpecies' in spl && spl.otherSpecies}
                            </span>
                            <br />
                            {spl.tag ? `${tMaps('tag')} #${spl.tag} • ` : null}
                            {spl?.measurements?.height}
                            {tMaps('meterHigh')} • {spl?.measurements?.width}
                            {tMaps('cmWide')}
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : (
                []
              )}
              <div className={`${styles.formField}`}>
                <div className={styles.formFieldHalf}>
                  <Button
                    onClick={handleBack}
                    variant="contained"
                    color="inherit"
                  >
                    {isUploadingData ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      tTreemapper('back')
                    )}
                  </Button>
                </div>
                <div className={styles.formFieldHalf}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                  >
                    {isUploadingData ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      tTreemapper('submit')
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            []
          )}
        </>
      )}
    </div>
  );
}
