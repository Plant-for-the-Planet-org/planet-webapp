import { useMemo } from 'react';
import AboutProject from './AboutProject';
import { useTranslations } from 'next-intl';
import ProjectReview from './ReviewReports';
import { CountryCode } from '@planet-sdk/common';
import styles from '../ProjectDetails.module.scss';
import KeyInfo from './KeyInfo';
import AdditionalInfo from './AdditionalInfo';
import VideoPlayer from './VideoPlayer';
import ImagesSlider from './ImagesSlider';
import ProjectDownloads from './ProjectDownloads';
import ContactDetails from './ContactDetails';
import MapPreview from './MapPreview';
import { SetState } from '../../../common/types/common';
import { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { ProjectExtend } from '../../ProjectsContext';

interface ProjectInfoSectionProps {
  project: ProjectExtend;
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
    slug,
    reviews,
    description,
    purpose,
    expenses,
    certificates,
  } = project;
  const isTreeProject = purpose === 'trees';

  const shouldRenderKeyInfo = useMemo(() => {
    if (!isTreeProject) return false;
    const {
      yearAbandoned,
      firstTreePlanted,
      plantingDensity,
      maxPlantingDensity,
      plantingSeasons,
    } = metadata;

    return Boolean(
      yearAbandoned ||
        firstTreePlanted ||
        plantingDensity ||
        maxPlantingDensity ||
        (plantingSeasons && plantingSeasons.length > 0)
    );
  }, [metadata]);

  const shouldRenderAdditionalInfo = useMemo(() => {
    const {
      mainChallenge,
      siteOwnerName,
      longTermPlan,
      acquisitionYear,
      motivation,
    } = metadata;
    return Boolean(
      mainChallenge ||
        siteOwnerName ||
        (isTreeProject &&
          metadata.siteOwnerType &&
          metadata.siteOwnerType?.length > 0) ||
        (isTreeProject && metadata.degradationCause) ||
        longTermPlan ||
        acquisitionYear ||
        motivation
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

  return (
    <section className={styles.projectInfoContainer}>
      {reviews?.length > 0 && <ProjectReview reviews={reviews} />}
      {description && <AboutProject description={description} wordCount={60} />}
      {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      {images.length > 0 && <ImagesSlider images={images} type={'project'} />}
      {isMobile && <MapPreview setSelectedMode={setSelectedMode} />}
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
        />
      )}
      {shouldRenderAdditionalInfo && (
        <AdditionalInfo
          mainChallengeText={metadata.mainChallenge}
          siteOwnershipText={metadata.siteOwnerName}
          siteOwnershipType={isTreeProject ? metadata.siteOwnerType : null}
          causeOfDegradationText={
            isTreeProject ? metadata.degradationCause : null
          }
          whyThisSiteText={metadata.motivation}
          longTermProtectionText={metadata.longTermPlan}
          acquiredSince={metadata.acquisitionYear}
        />
      )}
      {shouldRenderProjectDownloads && (
        <ProjectDownloads certification={certificates} spendings={expenses} />
      )}
      <ContactDetails
        publicProfileURL={`/t/${slug}`}
        websiteURL={website}
        location={location}
        email={tpo.email}
      />
    </section>
  );
};

export default ProjectInfoSection;
