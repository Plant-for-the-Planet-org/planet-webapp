import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useState } from 'react';
import style from './CarbonCapture.module.scss';
import DownArrow from '../icons/DownArrow';
import { Trans, useTranslation } from 'next-i18next';
import UpArrow from '../icons/UpArrow';
import { CO2BarGraph, CO2CaptureData } from './BarGraph';
import NewInfoIcon from '../icons/NewInfoIcon';

interface TabPanelProps {
  index: number;
  value: number;
  beforeIntervation: number;
  byProject: number;
  sitePotential: number;
}

type carbonCapture = Omit<TabPanelProps, 'value'>;

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

  const carbonCaptureDataProps = {
    beforeIntervation,
    byProject,
    sitePotential,
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
        <>
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
                <NewInfoIcon width={'19px'} height={'19px'} color={'#BDBDBD'} />
              </div>
            </div>
            <div className={style.carbonCaptureDetailContainer}>
              <CO2BarGraph {...carbonCaptureDataProps} />
              <CO2CaptureData {...carbonCaptureDataProps} />
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
  index,
}: carbonCapture) => {
  const [value, setValue] = React.useState(index);

  const TabProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={style.carbonCaptureModal}>
      <Tabs value={value} onChange={handleChange} sx={customStyle}>
        <Tab
          label={
            <Trans i18nKey="site">
              Site <p>({{ area: '12hpa' }})</p>
            </Trans>
          }
          {...TabProps(0)}
          className="tab"
        />
        <Tab
          label={
            <Trans i18nKey="entireProject">
              Entire Project <p>({{ area: '625hpa' }})</p>
            </Trans>
          }
          {...TabProps(1)}
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
