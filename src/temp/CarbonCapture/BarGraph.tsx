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
  const beforeIntervationIndicator = (
    beforeIntervation: number,
    sitePotential: number
  ) => {
    const beforeIntervationPercenatage =
      (beforeIntervation / sitePotential) * 100;

    return beforeIntervationPercenatage;
  };
  const byProjectIndicator = (byProject: number, sitePotential: number) => {
    const byProjectPercentage = (byProject / sitePotential) * 100;
    return byProjectPercentage;
  };
  return (
    <div className={style.carbonCaptureIndicator}>
      <div
        style={{
          width: `${beforeIntervationIndicator(
            beforeIntervation,
            sitePotential
          )}%`,
        }}
        className={style.beforeIntervationIndicator}
      />

      <div
        style={{
          width: `${byProjectIndicator(byProject, sitePotential)}%`,
        }}
        className={style.byProjectIndicator}
      />

      <div
        style={{
          width: `${
            100 -
            (beforeIntervationIndicator(beforeIntervation, sitePotential) +
              byProjectIndicator(byProject, sitePotential))
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
