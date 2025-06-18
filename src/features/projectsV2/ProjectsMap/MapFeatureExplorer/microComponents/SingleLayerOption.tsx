import type {
  ApiMapLayerOptionsType,
  LayerConfig,
  LegendData,
} from '../../../../../utils/mapsV2/mapSettings.config';
import type { ChangeEvent, MouseEvent } from 'react';
import type { MapOptions } from '../../../ProjectsMapContext';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Popover } from '@mui/material';
import LayerInfoPopupContent from './LayerInfoPopupContent';
import { StyledSwitch } from '../CustomSwitch';
import styles from '../MapFeatureExplorer.module.scss';
import LayerLegend from './LayerLegend';

interface Props {
  layerConfig: LayerConfig;
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
}

const SingleLayerOption = ({
  layerConfig,
  mapOptions,
  updateMapOption,
}: Props) => {
  if (!layerConfig.isAvailable) return null;

  const tExplore = useTranslations('Maps.exploreLayers');
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

  const hasInfoPopover =
    layerConfig.additionalInfo !== undefined && layerConfig.key !== 'projects';
  const isOptionSelected = mapOptions[layerConfig.key] === true;
  const isLegendAvailable = layerConfig.legend !== undefined;
  const isLegendVisible = isOptionSelected && isLegendAvailable;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement>) => {
      setAnchor(e.currentTarget);
    },
    []
  );

  const handleClose = () => {
    setAnchor(null);
  };

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isMovingToPopover = relatedTarget?.closest('[role="presentation"]');

    if (!isMovingToPopover) {
      handleClose();
    }
  }, []);

  const singleLayerOptionStyles = `${styles.singleLayerOption} ${
    isLegendVisible ? styles.legendVisible : ''
  }`;

  return (
    <div className={singleLayerOptionStyles}>
      <div className={styles.layerControls}>
        <div
          className={`${styles.layerLabel} ${
            hasInfoPopover ? styles.additionalInfo : ''
          }`}
        >
          <p
            onMouseEnter={hasInfoPopover ? handleMouseEnter : undefined}
            onMouseLeave={hasInfoPopover ? handleMouseLeave : undefined}
          >
            {tExplore(`settingsLabels.${layerConfig.key}`)}
          </p>
        </div>
        <div className={styles.switchContainer}>
          <StyledSwitch
            customColor={layerConfig.color}
            checked={isOptionSelected}
            onChange={(
              _event: ChangeEvent<HTMLInputElement>,
              checked: boolean
            ) => updateMapOption(layerConfig.key, checked)}
          />
        </div>
      </div>
      {isLegendVisible && (
        <LayerLegend legend={layerConfig.legend as LegendData} />
      )}

      {hasInfoPopover && (
        <Popover
          open={Boolean(anchor)}
          onClose={handleClose}
          anchorEl={anchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disableRestoreFocus
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
              marginTop: '-2px',
            },
          }}
          onMouseLeave={handleClose}
        >
          <div onMouseEnter={(e) => e.stopPropagation()}>
            <LayerInfoPopupContent
              layerKey={layerConfig.key as ApiMapLayerOptionsType}
              anchorElement={anchor}
              setAnchorElement={setAnchor}
              additionalInfo={layerConfig.additionalInfo}
              handleMouseLeave={handleClose}
            />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default SingleLayerOption;
