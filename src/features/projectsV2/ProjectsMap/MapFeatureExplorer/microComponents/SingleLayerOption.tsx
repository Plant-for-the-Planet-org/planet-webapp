import type { LayerConfig } from '../../../../../utils/mapsV2/mapSettings.config';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Popover } from '@mui/material';
import LayerInfoPopupContent from './LayerInfoPopupContent';
import { StyledSwitch } from '../CustomSwitch';
import styles from '../MapFeatureExplorer.module.scss';

interface Props {
  layerConfig: LayerConfig;
  /* label: string;
  switchComponent: ReactNode;
  showDivider: boolean;
  additionalInfo?: AdditionalInfo; */
}

const SingleLayerOption = ({ layerConfig }: Props) => {
  const tExplore = useTranslations('Maps.exploreLayers');
  const hasInfoPopover = layerConfig.additionalInfo !== undefined;

  if (!layerConfig.isAvailable) return <></>;

  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAnchor(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchor(null);
  };

  return (
    <>
      <div className={styles.singleLayerOption}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`${styles.layerLabel} ${
            hasInfoPopover ? styles.additionalInfo : ''
          }`}
        >
          <p>{tExplore(`settingsLabels.${layerConfig.key}`)}</p>
        </div>
        <div className={styles.switchContainer}>
          <StyledSwitch customColor={layerConfig.color} />
        </div>
      </div>
      {hasInfoPopover && (
        <Popover
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          anchorEl={anchor}
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
            anchorElement={anchor}
            setAnchorElement={setAnchor}
            additionalInfo={layerConfig.additionalInfo}
            handleMouseLeave={handleMouseLeave}
          />
        </Popover>
      )}
    </>
  );
};

export default SingleLayerOption;
