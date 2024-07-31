import { ReactElement } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  bindPopover,
  usePopupState,
  bindHover,
} from 'material-ui-popup-state/hooks';
import TopProjectReports from './projectDetails/TopProjectReports';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { Review } from '@planet-sdk/common';

interface Props {
  displayPopup: boolean;
  projectReviews: Review[] | undefined;
}

const VerifiedBadge = ({
  displayPopup,
  projectReviews,
}: Props): ReactElement => {
  const verifiedPopupState = usePopupState({
    variant: 'popover',
    popupId: 'verifiedPopover',
  });
  return (
    <>
      {' '}
      <span className={'verifiedIcon'}>
        <VerifiedIcon
          sx={{ width: '100%' }}
          {...bindHover(verifiedPopupState)}
        />
      </span>
      {displayPopup &&
        projectReviews !== undefined &&
        projectReviews.length > 0 && (
          <HoverPopover
            {...bindPopover(verifiedPopupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="topProjectReportsContainer">
              <TopProjectReports projectReviews={projectReviews} />
            </div>
          </HoverPopover>
        )}
    </>
  );
};

export default VerifiedBadge;
