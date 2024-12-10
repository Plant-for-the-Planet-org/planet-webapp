import type {
  EcosystemTypes,
  TreeProjectClassification,
} from '@planet-sdk/common';
import type {
  GiftGivenDetails,
  GiftReceivedDetails,
} from '../../../common/types/myForest';

import styles from './MyContributions.module.scss';
import GiftLabel from './GiftLabel';
import ProjectHeader from './ProjectHeader';

type RegistrationItemProps = {
  type: 'registration';
  projectName?: string;
  projectImageUrl?: string;
};

type ProjectItemBaseProps = {
  type: 'project';
  projectName: string;
  projectImageUrl?: string;
  giftDetails?: GiftGivenDetails | GiftReceivedDetails;
};

type ConservationProjectItemProps = {
  projectPurpose: 'conservation';
  projectEcosystem: Exclude<
    EcosystemTypes,
    'tropical-forests' | 'temperate'
  > | null;
};

type TreeProjectItemProps = {
  projectPurpose: 'trees';
  projectClassification: TreeProjectClassification | null;
};

type ProjectItemProps = ProjectItemBaseProps &
  (ConservationProjectItemProps | TreeProjectItemProps);

type Props = RegistrationItemProps | ProjectItemProps;

const ItemMobileHeader = (props: Props) => {
  const { type, projectImageUrl, projectName } = props;

  const projectHeaderProps =
    type === 'project'
      ? props.projectPurpose === 'trees'
        ? {
            projectName,
            projectPurpose: 'trees' as const,
            projectClassification: props.projectClassification,
          }
        : {
            projectName,
            projectPurpose: 'conservation' as const,
            projectEcosystem: props.projectEcosystem,
          }
      : null;

  return (
    <div
      className={styles.itemMobileHeader}
      style={
        projectImageUrl
          ? {
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${projectImageUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }
          : undefined
      }
    >
      {type === 'project' && projectHeaderProps !== null && (
        <div className={styles.headerContent}>
          {props.giftDetails !== undefined && (
            <GiftLabel giftDetails={props.giftDetails} />
          )}
          <div className={styles.projectHeaderContainer}>
            <ProjectHeader {...projectHeaderProps} color="light" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemMobileHeader;
