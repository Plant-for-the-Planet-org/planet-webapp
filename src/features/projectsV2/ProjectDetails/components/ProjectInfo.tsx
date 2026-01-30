import type { CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import AboutProject from './AboutProject';
import ProjectReview from './ProjectReviews';
import styles from '../styles/ProjectInfo.module.scss';
import KeyInfo from './KeyInfo';
import AdditionalInfo from './AdditionalInfo';
import VideoPlayer from './VideoPlayer';
import ProjectDownloads from './ProjectDownloads';
import ContactDetails from './ContactDetails';
import MapPreview from './MapPreview';
import ImageSlider from './ImageSlider';
import area from '@turf/area';
import { useInterventionStore } from '../../../../stores';

interface ProjectInfoProps {
  isMobile: boolean;
  hasVideoConsent: boolean;
  onVideoConsentChange: (consent: boolean) => void;
}

const ProjectInfo = ({
  isMobile,
  hasVideoConsent,
  onVideoConsentChange,
}: ProjectInfoProps) => {
  const tCountry = useTranslations('Country');
  const project = useInterventionStore((state) => state.singleProject);
  if (!project) return null;

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
    sites,
  } = project;
  const isTreeProject = purpose === 'trees';
  const isConservationProject = purpose === 'conservation';

  const shouldRenderKeyInfo = useMemo(() => {
    if (!isTreeProject && !isConservationProject) return false;
    // General conditions that apply to all projects (e.g employee count)
    const generalConditions = [
      metadata.employeesCount,
      sites && sites.length > 0,
    ];

    // Specific conditions for tree projects
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
    // Specific conditions for conservation projects
    const conservationProjectConditions = isConservationProject
      ? [
          metadata.activitySeasons && metadata.activitySeasons.length > 0,
          metadata.startingProtectionYear,
        ]
      : [];
    //Render key info if either tree or conservation project conditions are met
    return (
      (isTreeProject && treeProjectConditions.some(Boolean)) ||
      (isConservationProject && conservationProjectConditions.some(Boolean)) ||
      generalConditions.some(Boolean)
    );
  }, [metadata, isTreeProject, isConservationProject, sites]);

  const shouldRenderAdditionalInfo = useMemo(() => {
    const {
      mainChallenge,
      siteOwnerName,
      longTermPlan,
      acquisitionYear,
      motivation,
      mainInterventions,
    } = metadata;
    // General conditions that apply to all projects
    const generalConditions = [
      mainChallenge,
      siteOwnerName,
      longTermPlan,
      acquisitionYear,
      motivation,
      mainInterventions && mainInterventions?.length > 0,
    ];
    // Specific conditions for tree projects
    const treeProjectConditions = isTreeProject
      ? [
          metadata.siteOwnerType && metadata.siteOwnerType?.length > 0,
          metadata.degradationCause,
        ]
      : [];
    // Specific conditions for conservation projects
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
    //Render additional info if general, tree, or conservation conditions are met
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
    return certificates?.length > 0 || expenses?.length > 0;
  }, [certificates, expenses]);

  const projectAreaInHectares = useMemo(() => {
    try {
      if (sites && sites.length > 0) {
        const totalAreaSqM = sites.reduce((total, site) => {
          return total + (area(site.geometry) || 0);
        }, 0);
        return totalAreaSqM / 10000; // convert sqm → hectares
      }
    } catch (error) {
      console.error('Error calculating project area in hectares:', error);
      return null;
    }
    return null;
  }, [sites]);

  return (
    <section className={styles.projectInfoSection}>
      {reviews?.length > 0 && <ProjectReview reviews={reviews} />}
      {description && <AboutProject description={description} />}
      {videoUrl && (
        <VideoPlayer
          videoUrl={videoUrl}
          hasConsent={hasVideoConsent}
          onConsentChange={onVideoConsentChange}
        />
      )}
      {images?.length > 0 && (
        <ImageSlider
          images={images}
          type="project"
          isMobile={isMobile}
          imageSize="medium"
        />
      )}
      {isMobile && <MapPreview />}
      {shouldRenderKeyInfo && (
        <KeyInfo
          abandonment={isTreeProject ? metadata.yearAbandoned : null}
          firstTreePlanted={isTreeProject ? metadata.firstTreePlanted : null}
          startingProtectionYear={
            isConservationProject ? metadata.startingProtectionYear : null
          }
          plantingSeasons={isTreeProject ? metadata.plantingSeasons : null}
          activitySeasons={
            isConservationProject ? metadata.activitySeasons : null
          }
          plantingDensity={isTreeProject ? metadata.plantingDensity : null}
          maxPlantingDensity={
            isTreeProject ? metadata.maxPlantingDensity : null
          }
          employees={metadata.employeesCount}
          degradationYear={isTreeProject ? metadata.degradationYear : null}
          projectAreaInHectares={projectAreaInHectares}
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

export default ProjectInfo;
