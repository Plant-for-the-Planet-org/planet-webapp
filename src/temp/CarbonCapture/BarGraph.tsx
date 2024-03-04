import style from './CarbonCapture.module.scss';
import { useTranslation } from 'next-i18next';

interface CO2BarGraphProps {
  beforeIntervation: number;
  byProject: number;
  sitePotential: number;
}

const CO2BarGraph = ({
  beforeIntervation,
  byProject,
  sitePotential,
}: CO2BarGraphProps) => {
  const { t } = useTranslation(['projectDetails']);
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
        className={style.indicatorMainContainer}
      >
        <div className={style.beforeIntervationIndicator} />
        <div>
          <p className={style.beforeIntervationData}>
            {t('projectDetails:cO₂Quantity', {
              quantity: `${beforeIntervation}`,
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
      </div>
      <div
        style={{
          width: `${byProjectIndicator(byProject, sitePotential)}%`,
        }}
        className={style.indicatorMainContainer}
      >
        <div className={style.byProjectIndicator} />
        <div>
          <p className={style.byProjectData}>
            {t('projectDetails:byProjectCO₂Quantity', {
              quantity: `${byProject}`,
            })}
          </p>
          <p className={style.byProjectLabel}>
            {t('projectDetails:byProject')}
          </p>
          <p className={style.byProjectDate}>
            {t('projectDetails:since', {
              date: 2018,
            })}
          </p>
        </div>
      </div>
      <div
        style={{
          width: `${
            100 -
            (beforeIntervationIndicator(beforeIntervation, sitePotential) +
              byProjectIndicator(byProject, sitePotential))
          }%`,
          alignItems: 'flex-end',
        }}
        className={style.indicatorMainContainer}
      >
        <div className={style.projectPotential} />
        <div className={style.sitePotentialDataContainer}>
          <p className={style.sitePotentialData}>
            {t('projectDetails:cO₂Quantity', {
              quantity: `${sitePotential}`,
            })}
          </p>
          <p className={style.sitePotentialLabel}>
            {t('projectDetails:sitePotential')}
          </p>
        </div>
      </div>
    </div>
  );
};
export default CO2BarGraph;
