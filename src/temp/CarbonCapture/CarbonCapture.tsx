import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useState } from 'react';
import style from './CarbonCapture.module.scss';
import InfoIcon from '../icons/InfoIcon';
import DownArrow from '../icons/DownArrow';
import { Trans, useTranslation } from 'next-i18next';
import UpArrow from '../icons/UpArrow';

interface TabPanelProps {
  index: number;
  value: number;
  beforeIntervation: string;
  byProject: string;
  sitePotential: string;
}

type carbonCapture = Omit<TabPanelProps, 'index' | 'value'>;

function CustomTabPanel(props: TabPanelProps) {
  const {
    value,
    index,
    beforeIntervation,
    byProject,
    sitePotential,
    ...other
  } = props;

  const { t } = useTranslation(['projectDetails']);
  const [isExtend, setIsExtend] = useState(false);

  const width1 = (beforeIntervation, sitePotential) => {
    const beforeIntervationPercenatage =
      (beforeIntervation / sitePotential) * 100;

    return beforeIntervationPercenatage;
  };
  const width2 = (byProject, sitePotential) => {
    const _byProject = (byProject / sitePotential) * 100;
    return _byProject;
  };
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={style.carbonCaptureMainContainer}
      {...other}
    >
      {value === index && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={style.carbonCaptureInfoContainer}>
            <div className={style.carbonCaptureLabelMainContainer}>
              <div className={style.carbonCaptureLabelContainer}>
                <div className={style.carbonCapture}>
                  <Trans i18nKey="totalCO₂Captured">
                    Total CO₂ Captured <p>(tons)</p>
                  </Trans>
                </div>
              </div>
              <div className={style.infoIconContainer}>
                <InfoIcon />
              </div>
            </div>
            <div className={style.carbonCaptureDetailContainer}>
              <div className={style.carbonCaptureIndicator}>
                <div
                  style={{
                    width: `${width1(beforeIntervation, sitePotential)}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    className={style.beforeIntervationIndicator}
                    style={{
                      width: '100%',
                      height: '21px',
                    }}
                  />
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
                    width: `${width2(byProject, sitePotential)}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    className={style.byProjectIndicator}
                    style={{
                      width: '100%',
                      height: '21px',
                    }}
                  />
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
                      (width1(beforeIntervation, sitePotential) +
                        width2(byProject, sitePotential))
                    }%`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    alignItems: 'flex-end',
                  }}
                >
                  <div
                    className={style.projectPotential}
                    style={{
                      width: '100%',
                      height: '21px',
                    }}
                  />
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
            </div>
          </div>
          <button
            className={style.seeMoreButton}
            onClick={() => setIsExtend(!isExtend)}
          >
            <div className={style.seeMoreLabel}>
              {isExtend
                ? t('projectDetails:seeLess')
                : t('projectDetails:seeMore')}
            </div>
            <div className={style.downArrow}>
              {isExtend ? <UpArrow /> : <DownArrow />}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
const customStyle = {
  '.MuiTabs-flexContainer': {
    justifyContent: 'center',
    marginTop: '24px',
    gap: '30px',
  },
  '.MuiButtonBase-root': {
    textTransform: 'none',
    fontSize: '12px',
    fontWeight: '700',
    color: '#2F3336',
  },
  '.MuiButtonBase-root-MuiTab-root.Mui-selected': {
    color: '#007A49',
  },
  '.MuiTabs-indicator': {
    backgroundColor: '#007A49',
  },
  '.MuiTab-root.Mui-selected': {
    color: '#007A49',
    display: 'flex',
    flexDirection: 'row',
  },
  '.MuiTab-root': {
    minHeight: '0px',
    padding: '0px 0px',
    display: 'flex',
    flexDirection: 'row',
  },
};

const CarbonCapture = ({
  beforeIntervation,
  byProject,
  sitePotential,
}: carbonCapture) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation(['projectDetails']);
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className={style.carbonCaptureModal}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={customStyle}
      >
        <Tab
          label={
            <Trans i18nKey="site">
              Site <p>({{ area: '12hpa' }})</p>
            </Trans>
          }
          {...a11yProps(0)}
          className="tab"
        />
        <Tab
          label={
            <Trans i18nKey="entireProject">
              Entire Project <p>({{ area: '625hpa' }})</p>
            </Trans>
          }
          {...a11yProps(1)}
          className="tab"
        />
      </Tabs>
      <hr className={style.horizontalLine} />
      <CustomTabPanel
        beforeIntervation={beforeIntervation}
        byProject={byProject}
        sitePotential={sitePotential}
        value={value}
        index={0}
      />

      <CustomTabPanel
        beforeIntervation={beforeIntervation}
        byProject={byProject}
        sitePotential={sitePotential}
        value={value}
        index={1}
      />
    </div>
  );
};

export default CarbonCapture;
