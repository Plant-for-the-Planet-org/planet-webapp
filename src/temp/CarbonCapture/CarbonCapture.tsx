import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React from 'react';
import style from './CarbonCapture.module.scss';
import InfoIcon from '../icons/InfoIcon';
import DownArrow from '../icons/DownArrow';
import { useTranslation } from 'next-i18next';

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
        <>
          <div className={style.carbonCaptureInfoContainer}>
            <div className={style.carbonCaptureLabelMainContainer}>
              <div className={style.carbonCaptureLabelContainer}>
                <div className={style.carbonCapture}>
                  {t('projectDetails:totalCO₂Captured')}
                </div>
                <div className={style.unit}>(tons)</div>
              </div>
              <div className={style.infoIconContainer}>
                <InfoIcon />
              </div>
            </div>
            <div className={style.carbonCatureDetailContainer}>
              <div className={style.carbonCaptureIndicator}>
                <div className={style.beforeIntervationIndicator} />
                <div className={style.byProjectIndicator} />
                <div className={style.projectPotential} />
              </div>
              <div className={style.carbonCaptureDataContainer}>
                <div>
                  <p className={style.beforeIntervationData}>
                    {beforeIntervation}
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
                <div className={style.byProjectMainConatiner}>
                  <p className={style.byProjectData}>{byProject}</p>
                  <p className={style.byProjectLabel}>
                    {t('projectDetails:byProject')}
                  </p>
                  <p className={style.byProjectDate}>
                    {t('projectDetails:since', {
                      date: 2018,
                    })}
                  </p>
                </div>
                <div className={style.sitePotentialDataContainer}>
                  <p className={style.sitePotentialData}>{sitePotential}</p>
                  <p className={style.sitePotentialLabel}>
                    {t('projectDetails:sitePotential')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className={style.seeMoreButton}>
            <div className={style.seeMoreLabel}>
              {t('projectDetails:seeMore')}
            </div>
            <div className={style.downArrow}>
              <DownArrow />
            </div>
          </button>
        </>
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
  },
  '.MuiTab-root': {
    minHeight: '0px',
    padding: '0px 0px',
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
          label={t('projectDetails:site', {
            area: `12ha`,
          })}
          {...a11yProps(0)}
          className="tab"
        />
        <Tab
          label={t('projectDetails:entireProject', {
            area: `623ha`,
          })}
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
