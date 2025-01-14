import type { ReactElement } from 'react';

import {
  bindPopover,
  usePopupState,
  bindHover,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import TopProjectIcon from '../../../../public/assets/images/icons/project/TopProjectIcon';
import themeProperties from '../../../theme/themeProperties';
import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectSnippet.module.scss';

interface Props {
  displayPopup: boolean;
}

const TopProjectBadge = ({ displayPopup }: Props): ReactElement => {
  const topProjectPopupState = usePopupState({
    variant: 'popover',
    popupId: 'topProjectPopover',
  });
  const t = useTranslations('Common');
  return (
    <>
      <div
        className={styles.topProjectBadge}
        {...bindHover(topProjectPopupState)}
      >
        <div className={styles.badgeIcon}>
          <TopProjectIcon color={'#6D4230'} />
        </div>
        <div>{t('topProject')}</div>
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
          <div className={styles.topProjectPopupContainer}>
            {t.rich('top_project_standards_fulfilled', {
              standardsLink: (chunks) => (
                <a
                  target="_blank"
                  href={t('standardsLink')}
                  rel="noreferrer"
                  style={{
                    color: themeProperties.primaryColor,
                    fontWeight: 400,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {chunks}
                </a>
              ),
            })}
          </div>
        </HoverPopover>
      )}
    </>
  );
};

export default TopProjectBadge;
