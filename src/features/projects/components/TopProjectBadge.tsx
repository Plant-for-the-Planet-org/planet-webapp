import { ReactElement } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import {
  bindPopover,
  usePopupState,
  bindHover,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import TopProjectIcon from '../../../../public/assets/images/icons/project/TopProjectIcon';
import themeProperties from '../../../theme/themeProperties';

interface Props {
  displayPopup: boolean;
}

const TopProjectBadge = ({ displayPopup }: Props): ReactElement => {
  const topProjectPopupState = usePopupState({
    variant: 'popover',
    popupId: 'topProjectPopover',
  });
  const { t } = useTranslation('common');
  return (
    <>
      <div className={'topProjectBadge'} {...bindHover(topProjectPopupState)}>
        <div className={'badgeIcon'}>
          <TopProjectIcon />
        </div>
        <div>{t('common:topProject')}</div>
      </div>
      {displayPopup && (
        <HoverPopover
          {...bindPopover(topProjectPopupState)}
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
          <div className="topProjectPopupContainer">
            <Trans i18nKey="common:top_project_standards_fulfilled">
              The project inspection revealed that this project fulfilled at
              least 12 of the 19 Top Project{' '}
              <a
                target="_blank"
                href={t('common:standardsLink')}
                rel="noreferrer"
                style={{ color: themeProperties.primaryColor, fontWeight: 400 }}
                onClick={(e) => e.stopPropagation()}
              >
                standards.
              </a>
            </Trans>
          </div>
        </HoverPopover>
      )}
    </>
  );
};

export default TopProjectBadge;
