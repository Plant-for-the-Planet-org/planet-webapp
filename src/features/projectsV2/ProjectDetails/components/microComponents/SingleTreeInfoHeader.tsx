import type {
  SingleTreeRegistration,
  SampleTreeRegistration,
} from '../../../../common/types/intervention';

import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../../utils/getImageURL';
import { formatHid } from '../../../../../utils/projectV2';
import styles from '../../styles/InterventionInfo.module.scss';

type Props = {
  activeSingleTree: SingleTreeRegistration | SampleTreeRegistration;
};

function SingleTreeInfoHeader({ activeSingleTree }: Props) {
  const tProjectDetails = useTranslations('ProjectDetails');
  const isSamplePlant = activeSingleTree.type === 'sample-tree-registration';
  const image = activeSingleTree?.coordinates?.[0]?.image ?? '';

  return (
    <>
      <div
        className={`single-intervention-heading ${styles.singleInterventionHeading}`}
      >
        <h1 className="tree-count">
          {isSamplePlant
            ? tProjectDetails('sampleTree')
            : tProjectDetails('1Tree')}
        </h1>
        <div className="hid">{formatHid(activeSingleTree?.hid)}</div>
      </div>
      {image && (
        <>
          <img
            src={getImageUrl('coordinate', 'large', image)}
            className={`single-intervention-image ${styles.singleInterventionImage}`}
            loading="lazy"
          />
        </>
      )}
    </>
  );
}
export default SingleTreeInfoHeader;
