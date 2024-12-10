import { useLocale } from 'next-intl';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';
import type { SetState } from '../../../common/types/common';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

import styles from '../../ProjectsMap/InterventionDropDown/InterventionList.module.scss';

type SiteData = {
  label: string;
  id: number;
};
interface InterventionListProps {
  siteList: SiteData[];
  setSelectedSite: SetState<number | null>;
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: SiteData | undefined;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}
const InterventionList = ({
  siteList,
  setSelectedSite,
  setIsMenuOpen,
  selectedSiteData,
  setSelectedPlantLocation,
  setSelectedSamplePlantLocation,
}: InterventionListProps) => {
  const locale = useLocale();
  const handleSiteSelection = (index: number) => {
    setSelectedPlantLocation(null);
    setSelectedSamplePlantLocation(null);
    setIsMenuOpen(false);
    setSelectedSite(index);
  };

  return (
    <ul className={styles.siteListOptions}>
      {siteList.map((site, index) => {
        return (
          <li
            className={`${styles.listItem} ${
              site.id === selectedSiteData?.id ? styles.selectedItem : ''
            }`}
            onClick={() => handleSiteSelection(index)}
            key={index}
          >
            <p>{site.label}</p>
            {/* <p className={styles.siteArea}>
              {getFormattedRoundedNumber(locale, site.siteArea, 0)} ha
            </p> */}
          </li>
        );
      })}
    </ul>
  );
};

export default InterventionList;
