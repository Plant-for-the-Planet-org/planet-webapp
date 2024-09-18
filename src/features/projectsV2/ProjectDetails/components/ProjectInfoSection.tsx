import { useMemo } from 'react';
import AboutProject from './AboutProject';
import { useTranslations } from 'next-intl';
import ProjectReview from './ProjectReviews';
import { CountryCode } from '@planet-sdk/common';
import styles from '../ProjectDetails.module.scss';
import KeyInfo from './KeyInfo';
import AdditionalInfo from './AdditionalInfo';
import VideoPlayer from './VideoPlayer';
import ProjectDownloads from './ProjectDownloads';
import ContactDetails from './ContactDetails';
import MapPreview from './MapPreview';
import { SetState } from '../../../common/types/common';
import { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import ImageSlider from './microComponents/ImageSlider';
import { ExtendedProject } from '../../../common/types/projectv2';

interface ProjectInfoSectionProps {
  project: ExtendedProject;
  isMobile: boolean;
  setSelectedMode: SetState<ViewMode> | undefined;
}

const ProjectInfoSection = ({
  project,
  isMobile,
  setSelectedMode,
}: ProjectInfoSectionProps) => {
  const tCountry = useTranslations('Country');
  const {
    metadata,
    tpo,
    videoUrl,
    images,
    website,
    reviews,
    description,
    purpose,
    expenses,
    certificates,
    unitType,
  } = project;
  const isTreeProject = purpose === 'trees';
  const isConservationProject = purpose === 'conservation';
  const isRestorationProject = purpose === 'trees' && unitType === 'm2';

  const shouldRenderKeyInfo = useMemo(() => {
    if (!isTreeProject && !isConservationProject) return false;
    return Boolean(
      (isTreeProject && metadata.yearAbandoned) ||
        (isTreeProject && metadata.firstTreePlanted) ||
        (isTreeProject && metadata.plantingDensity) ||
        (isTreeProject && metadata.maxPlantingDensity) ||
        (isTreeProject &&
          metadata.plantingSeasons &&
          metadata.plantingSeasons.length > 0) ||
        (isConservationProject &&
          metadata.activitySeasons &&
          metadata.activitySeasons.length > 0)
    );
  }, [metadata]);

  const shouldRenderAdditionalInfo = useMemo(() => {
    const {
      mainChallenge,
      siteOwnerName,
      longTermPlan,
      acquisitionYear,
      motivation,
      mainInterventions,
    } = metadata;
    return Boolean(
      mainChallenge ||
        siteOwnerName ||
        (isTreeProject &&
          metadata.siteOwnerType &&
          metadata.siteOwnerType?.length > 0) ||
        (isConservationProject &&
          metadata.landOwnershipType &&
          metadata.landOwnershipType?.length > 0) ||
        (isTreeProject && metadata.degradationCause) ||
        longTermPlan ||
        acquisitionYear ||
        motivation ||
        (mainInterventions && mainInterventions?.length > 0)
    );
  }, [metadata]);

  const location = useMemo(() => {
    if (!tpo.address) return '';
    const { address, zipCode, city, country } = tpo.address;
    return [
      address,
      zipCode,
      city,
      country
        ? tCountry(tpo.address.country.toLowerCase() as Lowercase<CountryCode>)
        : '',
    ]
      .filter(Boolean)
      .join(',');
  }, [tpo]);

  const shouldRenderProjectDownloads = useMemo(() => {
    return certificates.length > 0 || expenses.length > 0;
  }, [certificates, expenses]);
  const handleMap = () => setSelectedMode?.('map');

  const siteOwnershipType = isTreeProject
    ? metadata.siteOwnerType
    : isConservationProject
    ? metadata.landOwnershipType
    : null;
  return (
    <section className={styles.projectInfoSection}>
      {reviews?.length > 0 && <ProjectReview reviews={reviews} />}
      {description && <AboutProject description={description} />}
      {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      {images.length > 0 && (
        <ImageSlider images={images} type={'project'} isMobile={isMobile} />
      )}
      {isMobile && <MapPreview handleMap={handleMap} />}
      {shouldRenderKeyInfo && (
        <KeyInfo
          abandonment={isTreeProject ? metadata.yearAbandoned : null}
          firstTree={isTreeProject ? metadata.firstTreePlanted : null}
          plantingDensity={isTreeProject ? metadata.plantingDensity : null}
          maxPlantingDensity={
            isTreeProject ? metadata.maxPlantingDensity : null
          }
          employees={metadata.employeesCount}
          plantingSeasons={isTreeProject ? metadata.plantingSeasons : null}
          activitySeason={
            isConservationProject ? metadata.activitySeasons : null
          }
          isRestorationProject={isRestorationProject}
        />
      )}
      {shouldRenderAdditionalInfo && (
        <AdditionalInfo
          mainChallengeText={metadata.mainChallenge}
          siteOwnershipText={metadata.siteOwnerName}
          siteOwnershipType={siteOwnershipType}
          causeOfDegradationText={
            isTreeProject ? metadata.degradationCause : null
          }
          whyThisSiteText={metadata.motivation}
          longTermProtectionText={metadata.longTermPlan}
          acquiredSince={metadata.acquisitionYear}
          mainInterventions={metadata.mainInterventions}
        />
      )}
      {shouldRenderProjectDownloads && (
        <ProjectDownloads certificates={certificates} expenses={expenses} />
      )}
      <ContactDetails
        publicProfileURL={`/t/${tpo.slug}`}
        websiteURL={website}
        location={location}
        email={tpo.email}
      />
    </section>
  );
};

export default ProjectInfoSection;
