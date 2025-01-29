import type { AdditionalInfo } from './MapSettingsSection';
import type { ReactNode } from 'react';

// import { useState } from 'react';
import styles from '../MapFeatureExplorer.module.scss';
// import { Popover } from '@mui/material';
// import LayerInfoPopupContent from './LayerInfoPopupContent';

interface Props {
  label: string;
  switchComponent: ReactNode;
  showDivider: boolean;
  additionalInfo?: AdditionalInfo;
}

const LayerSwitchContainer = ({
  label,
  switchComponent,
  showDivider,
}: Props) => {
  // const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  // const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  //   setAnchorEl(e.currentTarget);
  // };

  // const handleMouseLeave = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      <div className={styles.layerSwitchContainer}>
        <div
          className={showDivider ? styles.mapLayer : undefined}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <p>{label}</p>
          {showDivider && <hr />}
        </div>
        <div className={styles.switchContainer}>{switchComponent}</div>
      </div>
      {/* {showDivider && <hr />}
      {showDivider && (
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
            additionalInfo={additionalInfo}
            handleMouseLeave={handleMouseLeave}
          />
        </Popover>
      )} */}
    </>
  );
};

export default LayerSwitchContainer;
