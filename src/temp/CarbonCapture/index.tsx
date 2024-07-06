import Tab from '@mui/material/Tab';
import React, { useState, SyntheticEvent } from 'react';
import style from './CarbonCapture.module.scss';
import DownArrow from '../icons/DownArrow';
import { useTranslations } from 'next-intl';
import UpArrow from '../icons/UpArrow';
import { CO2BarGraph, CO2CaptureData } from './BarGraph';
import NewInfoIcon from '../icons/NewInfoIcon';
import themeProperties from '../../theme/themeProperties';
import CustomMuiTabs from './CustomMuiTabs';

interface CarbonCaptureProps {
  index: number;
  value: number;
  beforeIntervation: number;
  byProject: number;
  sitePotential: number;
  area: number;
}
type TabPanelProps = Omit<CarbonCaptureProps, 'area'>;

function CustomTabPanel(props: TabPanelProps) {
  const {
    value,
    index,
    beforeIntervation,
    byProject,
    sitePotential,
    ...other
  } = props;
  const { light } = themeProperties;
  const t = useTranslations('ProjectDetails');
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
                  {t('totalCO₂Captured')}
                </div>
              </div>
              <div className={style.infoIconContainer}>
                <NewInfoIcon width={17.6} color={light.dividerColorNew} />
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
              {isExtend ? t('seeLess') : t('seeMore')}
            </div>
            <div className={style.downArrow}>
              {isExtend ? <UpArrow width={7} /> : <DownArrow width={7} />}
            </div>
          </button>
        </>
      )}
    </div>
  );
}

const CarbonCapture = ({
  beforeIntervation,
  byProject,
  sitePotential,
  index,
  area,
}: CarbonCaptureProps) => {
  const [value, setValue] = useState(index);
  const t = useTranslations('ProjectDetails');
  const TabProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={style.carbonCaptureModal}>
      <CustomMuiTabs value={value} onChange={handleTabChange}>
        <Tab
          label={t.rich('site', {
            areaContainer: (chunks) => (
              <span className={style.areaCount}>{chunks}</span>
            ),
            area: area,
          })}
          {...TabProps(0)}
          className="tab"
        />
        <Tab
          label={t.rich('entireProject', {
            areaContainer: (chunks) => (
              <span className={style.areaCount}>{chunks}</span>
            ),
            area: area,
          })}
          {...TabProps(1)}
          className="tab"
        />
      </CustomMuiTabs>
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
