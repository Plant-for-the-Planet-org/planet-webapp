import type { SetState } from '../../../common/types/common';

import { useLocale } from 'next-intl';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';
import styles from '../../ProjectsMap/ProjectSiteDropDown/SiteDropdown.module.scss';
import { clsx } from 'clsx';
import { useSingleProjectStore } from '../../../../stores';
import { useRouter } from 'next/router';

type SiteData = {
  siteName: string;
  siteArea: number;
  id: number;
};
interface ProjectSiteListProps {
  siteList: SiteData[];
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: SiteData | undefined;
}

const ProjectSiteList = ({
  siteList,
  setIsMenuOpen,
  selectedSiteData,
}: ProjectSiteListProps) => {
  const locale = useLocale();
  const router = useRouter();
  // store: action

  const selectSiteAndSyncUrl = useSingleProjectStore(
    (state) => state.selectSiteAndSyncUrl
  );
  const handleSiteSelection = (index: number) => {
    selectSiteAndSyncUrl(index, locale, router);
    setIsMenuOpen(false);
  };

  return (
    <ul className={styles.siteListOptions}>
      {siteList.map((site, index) => {
        return (
          <li
            className={clsx(styles.listItem, {
              [styles.selectedItem]: site.id === selectedSiteData?.id,
            })}
            onClick={() => handleSiteSelection(index)}
            key={index}
          >
            <p>{site.siteName}</p>
            <p className={styles.siteArea}>
              {getFormattedRoundedNumber(locale, site.siteArea, 0)} ha
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectSiteList;
