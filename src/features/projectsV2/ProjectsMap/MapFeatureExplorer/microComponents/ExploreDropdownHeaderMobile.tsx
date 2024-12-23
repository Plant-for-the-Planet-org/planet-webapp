import type { SetState } from '../../../../common/types/common';

import { useTranslations } from 'next-intl';
import { ExploreIcon } from '../../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CrossIcon from '../../../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../MapFeatureExplorer.module.scss';

interface Props {
  setIsOpen: SetState<boolean>;
}

const ExploreDropdownHeaderMobile = ({ setIsOpen }: Props) => {
  const tMaps = useTranslations('Maps');
  return (
    <div className={styles.exploreFeatureMobileHeader}>
      <div className={styles.exploreLabel}>
        <ExploreIcon />
        <p>{tMaps('explore')}</p>
      </div>
      <button onClick={() => setIsOpen(false)}>
        <CrossIcon />
      </button>
    </div>
  );
};

export default ExploreDropdownHeaderMobile;
