import { ReactElement } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  bindPopover,
  usePopupState,
  bindHover,
} from 'material-ui-popup-state/hooks';
import TopProjectReports from './projectDetails/TopProjectReports';
import HoverPopover from 'material-ui-popup-state/HoverPopover';

interface Props {
  displayPopup: Boolean;
  project: any;
}

const VerifiedBadge = ({ displayPopup, project }: Props): ReactElement => {
  const verifiedPopupState = usePopupState({
    variant: 'popover',
    popupId: 'demoVerifiedPopover',
  });
  return (
    <>
      <VerifiedIcon
        sx={{ color: '#fff', fontSize: 17 }}
        className={'verifiedIcon'}
        {...bindHover(verifiedPopupState)}
      />
      {displayPopup && (
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
            <TopProjectReports projectReviews={project.reviews} />
          </div>
        </HoverPopover>
      )}
    </>
  );
};

export default VerifiedBadge;
