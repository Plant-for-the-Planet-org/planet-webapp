import { useMemo } from 'react';
import AboutProject from './AboutProject';
import { useTranslations } from 'next-intl';
import ProjectReview from './ProjectReviews';
import { CountryCode } from '@planet-sdk/common';
import styles from '../styles/ProjectInfo.module.scss';
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
  } = project;
  const isTreeProject = purpose === 'trees';
  const isConservationProject = purpose === 'conservation';

  const shouldRenderKeyInfo = useMemo(() => {
    if (!isTreeProject && !isConservationProject) return false;
    const generalConditions = [metadata.employeesCount];

    const treeProjectConditions = isTreeProject
      ? [
          metadata.yearAbandoned,
          metadata.firstTreePlanted,
          metadata.plantingDensity,
          metadata.maxPlantingDensity,
          metadata.plantingSeasons && metadata.plantingSeasons.length > 0,
          metadata.degradationYear,
        ]
      : [];

    const conservationProjectConditions = isConservationProject
      ? [
          metadata.activitySeasons && metadata.activitySeasons.length > 0,
          metadata.startingProtectionYear,
        ]
      : [];

    return (
      (isTreeProject && treeProjectConditions.some(Boolean)) ||
      (isConservationProject && conservationProjectConditions.some(Boolean)) ||
      generalConditions.some(Boolean)
    );
  }, [metadata, isTreeProject, isConservationProject]);

  const shouldRenderAdditionalInfo = useMemo(() => {
    const {
      mainChallenge,
      siteOwnerName,
      longTermPlan,
      acquisitionYear,
      motivation,
      mainInterventions,
    } = metadata;
    const generalConditions = [
      mainChallenge,
      siteOwnerName,
      longTermPlan,
      acquisitionYear,
      motivation,
      mainInterventions && mainInterventions?.length > 0,
    ];
    const treeProjectConditions = isTreeProject
      ? [
          metadata.siteOwnerType && metadata.siteOwnerType?.length > 0,
          metadata.degradationCause,
        ]
      : [];
    const conservationProjectConditions = isConservationProject
      ? [
          metadata.landOwnershipType && metadata.landOwnershipType?.length > 0,
          metadata.actions,
          metadata.socialBenefits,
          metadata.ecologicalBenefits,
          metadata.coBenefits,
          metadata.benefits,
          metadata.ownershipType,
        ]
      : [];

    return (
      generalConditions.some(Boolean) ||
      treeProjectConditions.some(Boolean) ||
      conservationProjectConditions.some(Boolean)
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
          interventionStarted={
            isTreeProject
              ? metadata.firstTreePlanted
              : metadata.startingProtectionYear
          }
          interventionSeasons={
            isTreeProject ? metadata.plantingSeasons : metadata.activitySeasons
          }
          plantingDensity={isTreeProject ? metadata.plantingDensity : null}
          maxPlantingDensity={
            isTreeProject ? metadata.maxPlantingDensity : null
          }
          employees={metadata.employeesCount}
          isTreeProject={isTreeProject}
          degradationYear={isTreeProject ? metadata.degradationYear : null}
        />
      )}
      {shouldRenderAdditionalInfo && (
        <AdditionalInfo
          mainChallenge={metadata.mainChallenge}
          siteOwnerName={metadata.siteOwnerName}
          siteOwnershipType={
            isTreeProject
              ? metadata.siteOwnerType
              : isConservationProject
              ? metadata.landOwnershipType
              : null
          }
          causeOfDegradation={isTreeProject ? metadata.degradationCause : null}
          whyThisSite={metadata.motivation}
          longTermPlan={metadata.longTermPlan}
          acquiredSince={metadata.acquisitionYear}
          mainInterventions={metadata.mainInterventions}
          actions={isConservationProject ? metadata.actions : null}
          socialBenefits={
            isConservationProject ? metadata.socialBenefits : null
          }
          ecologicalBenefits={
            isConservationProject ? metadata.ecologicalBenefits : null
          }
          benefits={isConservationProject ? metadata.benefits : null}
          coBenefits={isConservationProject ? metadata.coBenefits : null}
          ownershipTenure={
            isConservationProject ? metadata.ownershipType : null
          }
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
