import type { LandOwnershipTypes } from '@planet-sdk/common';
import styles from '../../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';

interface SiteOwnershipContentProps {
  siteOwnershipType: LandOwnershipTypes[] | null;
  siteOwnerName: string | null;
  acquiredSince: number | null;
}

const SITE_OWNERS_TYPE = [
  { value: 'private', key: 'siteOwnershipTypes.private' },
  { value: 'public-property', key: 'siteOwnershipTypes.public-property' },
  { value: 'smallholding', key: 'siteOwnershipTypes.smallholding' },
  { value: 'communal-land', key: 'siteOwnershipTypes.communal-land' },
  { value: 'owned-by-owner', key: 'siteOwnershipTypes.owned-by-owner' },
  { value: 'other', key: 'siteOwnershipTypes.other' },
] as const;

const SiteOwnershipContent = ({
  siteOwnershipType,
  siteOwnerName,
  acquiredSince,
}: SiteOwnershipContentProps) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  const renderSiteOwnershipType = (type: string) => {
    const ownerType = SITE_OWNERS_TYPE.find((item) => item.value === type);
    return ownerType ? tProjectDetails(ownerType.key) : type;
  };

  return (
    <div className={styles.siteOwnershipContent}>
      <div>
        {tProjectDetails('siteOwnershipSummary', {
          owner: siteOwnerName ?? '',
          acquisitionYear: acquiredSince ?? '',
        })}
      </div>
      <div className={styles.ownershipTypeContainer}>
        {siteOwnershipType?.map((type) => (
          <span key={type}>{renderSiteOwnershipType(type)}</span>
        ))}
      </div>
    </div>
  );
};

export default SiteOwnershipContent;
