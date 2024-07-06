import style from './CarbonCapture.module.scss';
import { useTranslations, useLocale } from 'next-intl';
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
  const t = useTranslations('ProjectDetails');
  const locale = useLocale();
  return (
    <div className={style.carbonCaptureDataContainerMain}>
      <div>
        <p className={style.beforeIntervationData}>
          {t('co₂Quantity', {
            quantity: getFormattedNumber(locale, beforeIntervation),
          })}
        </p>
        <p className={style.beforeIntervationLabel}>
          {t('beforeIntervention')}
        </p>
        <p className={style.beforeIntervationDate}>
          {t('before', {
            date: 2018,
          })}
        </p>
      </div>
      <div>
        <p className={style.byProjectData}>
          {t('byProjectCO₂Quantity', {
            quantity: getFormattedNumber(locale, byProject),
          })}
        </p>
        <p className={style.byProjectLabel}>{t('byProject')}</p>
        <p className={style.byProjectDate}>
          {t('since', {
            date: 2018,
          })}
        </p>
      </div>
      <div className={style.sitePotentialDataContainer}>
        <p className={style.sitePotentialData}>
          {t('co₂Quantity', {
            quantity: getFormattedNumber(locale, sitePotential),
          })}
        </p>
        <p className={style.sitePotentialLabel}>{t('sitePotential')}</p>
      </div>
    </div>
  );
};
