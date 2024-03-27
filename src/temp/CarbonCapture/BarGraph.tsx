import style from './CarbonCapture.module.scss';
import { useTranslation } from 'next-i18next';
import { getFormattedNumber } from '../../utils/getFormattedNumber';

interface CO2BarGraphProps {
  beforeIntervation: number;
  byProject: number;
  sitePotential: number;
}

export const CO2BarGraph = ({
  beforeIntervation,
  byProject,
  sitePotential,
}: CO2BarGraphProps) => {
  const calculatePercentage = (value: number, sitePotential: number) => {
    return (value / sitePotential) * 100;
  };

  const beforeIntervationPercentage = calculatePercentage(
    beforeIntervation,
    sitePotential
  );
  const byProjectPercentage = calculatePercentage(byProject, sitePotential);

  return (
    <div className={style.carbonCaptureIndicator}>
      <div
        style={{
          width: `${beforeIntervationPercentage}%`,
        }}
        className={style.beforeIntervationIndicator}
      />

      <div
        style={{
          width: `${byProjectPercentage}%`,
        }}
        className={style.byProjectIndicator}
      />

      <div
        style={{
          width: `${
            100 - (beforeIntervationPercentage + byProjectPercentage)
          }%`,
        }}
        className={style.projectPotential}
      />
    </div>
  );
};

export const CO2CaptureData = ({
  beforeIntervation,
  byProject,
  sitePotential,
}: CO2BarGraphProps) => {
  const { t, i18n } = useTranslation(['projectDetails']);
  return (
    <div className={style.carbonCaptureDataContainerMain}>
      <div>
        <p className={style.beforeIntervationData}>
          {t('projectDetails:cO₂Quantity', {
            quantity: getFormattedNumber(i18n.language, beforeIntervation),
          })}
        </p>
        <p className={style.beforeIntervationLabel}>
          {t('projectDetails:beforeIntervention')}
        </p>
        <p className={style.beforeIntervationDate}>
          {t('projectDetails:before', {
            date: 2018,
          })}
        </p>
      </div>
      <div>
        <p className={style.byProjectData}>
          {t('projectDetails:byProjectCO₂Quantity', {
            quantity: getFormattedNumber(i18n.language, byProject),
          })}
        </p>
        <p className={style.byProjectLabel}>{t('projectDetails:byProject')}</p>
        <p className={style.byProjectDate}>
          {t('projectDetails:since', {
            date: 2018,
          })}
        </p>
      </div>
      <div className={style.sitePotentialDataContainer}>
        <p className={style.sitePotentialData}>
          {t('projectDetails:cO₂Quantity', {
            quantity: getFormattedNumber(i18n.language, sitePotential),
          })}
        </p>
        <p className={style.sitePotentialLabel}>
          {t('projectDetails:sitePotential')}
        </p>
      </div>
    </div>
  );
};
