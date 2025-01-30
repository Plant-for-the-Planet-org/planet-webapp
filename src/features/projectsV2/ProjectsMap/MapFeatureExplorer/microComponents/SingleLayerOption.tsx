import type { AdditionalInfo } from './MapSettingsSection';
import type { ChangeEvent, ReactNode } from 'react';
import type { LayerConfig } from '../../../../../utils/mapsV2/mapSettings.config';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../MapFeatureExplorer.module.scss';
// import { Popover } from '@mui/material';
// import LayerInfoPopupContent from './LayerInfoPopupContent';
import { StyledSwitch } from '../CustomSwitch';
import { MapOptions } from 'maplibre-gl';

// import { Popover } from '@mui/material';
// import LayerInfoPopupContent from './LayerInfoPopupContent';

interface Props {
  layerConfig: LayerConfig;
  /* label: string;
  switchComponent: ReactNode;
  showDivider: boolean;
  additionalInfo?: AdditionalInfo; */
}

const SingleLayerOption = ({ layerConfig }: Props) => {
  const tExplore = useTranslations('Maps.exploreLayers');
  // const hasInfoPopover = layerConfig.additionalInfo !== undefined;

  if (!layerConfig.isAvailable) return <></>;

  // const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  // const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  //   setAnchorEl(e.currentTarget);
  // };

  // const handleMouseLeave = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      <div className={styles.singleLayerOption}>
        <div
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        >
          <p>{tExplore(`settingsLabels.${layerConfig.key}`)}</p>
        </div>
        <div className={styles.switchContainer}>
          <StyledSwitch customColor={layerConfig.color} />
        </div>
      </div>
      {/* {hasInfoPopover && (
        <Popover
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disableRestoreFocus
          sx={{
            pointerEvents: 'auto', // Enable pointer events
            '& .MuiPaper-root': {
              borderRadius: '12px',
              marginTop: '-8px',
              pointerEvents: 'auto', // Ensure interaction inside Popover works
            },
          }}
        >
          <LayerInfoPopupContent
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            additionalInfo={layerConfig.additionalInfo}
            handleMouseLeave={handleMouseLeave}
          />
        </Popover>
      )} */}
    </>
  );
};

export default SingleLayerOption;
