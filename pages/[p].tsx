import { useRouter } from 'next/router';
import React from 'react';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import { ProjectPropsContext } from '../src/features/common/Layout/ProjectPropsContext';
import Credits from '../src/features/projects/components/maps/Credits';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
import { getRequest } from '../src/utils/apiRequests/api';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import { getAllPlantLocations } from '../src/utils/maps/plantLocations';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { SingleProjectGeojson } from '../src/features/common/types/project';
import { handleError, APIError } from '@planet-sdk/common';

interface Props {
  initialized: boolean;
  currencyCode: string;
  setCurrencyCode: Function;
}

export default function Donate({
  initialized,
  currencyCode,
  setCurrencyCode,
}: Props) {
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');
  const [internalLanguage, setInternalLanguage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { i18n } = useTranslation();
  const {
    geoJson,
    project,
    setSelectedSite,
    setProject,
    setSelectedPl,
    plantLocations,
    setShowSingleProject,
    setZoomLevel,
    setPlantLocations,
    selectedPl,
    hoveredPl,
    setPlantLocationsLoaded,
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    setZoomLevel(2);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadProject() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== i18n.language
      ) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setInternalLanguage(i18n.language);
        setCurrencyCode(currency);
        try {
          const { p } = router.query;
          const project = await getRequest(encodeURI(`/app/projects/${p}`), {
            _scope: 'extended',
            currency: currency,
            locale: i18n.language,
          });
          setProject(project);
          setShowSingleProject(true);
          setZoomLevel(2);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/');
        }
      }
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currencyCode, i18n.language]);

  React.useEffect(() => {
    async function loadPl() {
      setPlantLocationsLoaded(false);
      const newPlantLocations = await getAllPlantLocations(
        project.id,
        setErrors,
        redirect
      );
      setPlantLocations(newPlantLocations);
      setPlantLocationsLoaded(true);
    }
    if (project && project.purpose === 'trees') {
      loadPl();
    }
  }, [project]);

  const ProjectProps = {
    project,
    currencyCode,
    setCurrencyCode,
    plantLocation: hoveredPl ? hoveredPl : selectedPl,
  };

  React.useEffect(() => {
    if (router.asPath) {
      const isDonation = router.asPath.search('#donate');
      if (isDonation && isDonation != -1) {
        handleOpen();
      }
    }
  }, [router.asPath]);

  React.useEffect(() => {
    if (geoJson && !router.query.site && !router.query.ploc) {
      router.push(
        `/${project.slug}?site=${geoJson.features[0].properties.id}`,
        undefined,
        { shallow: true }
      );
    }
  }, [router, geoJson]);

  React.useEffect(() => {
    //for selecting one of the site of project if user use link  to directly visit to site from home page
    if (geoJson && router.query.site) {
      const siteIndex: number = geoJson?.features.findIndex(
        (singleSite: SingleProjectGeojson) => {
          return router.query.site === singleSite?.properties.id;
        }
      );
      if (siteIndex === -1) {
        router.push(`/${project.slug}`);
      } else {
        setSelectedSite(siteIndex);
      }
    }
  }, [setSelectedSite, geoJson]);

  React.useEffect(() => {
    //for selecting one of the plant location. if user use link  to directly visit to plantLocation from home page
    if (geoJson && router.query.ploc && plantLocations) {
      const singlePlantLocation: Treemapper.PlantLocation | undefined =
        plantLocations?.find(
          (dataOfSinglePlantLocation: Treemapper.PlantLocation) => {
            return router.query.ploc === dataOfSinglePlantLocation?.hid;
          }
        );

      if (singlePlantLocation === undefined) {
        router.push(`/${project.slug}`);
      } else {
        setSelectedPl(singlePlantLocation);
      }
    }
  }, [router, router.query.ploc, plantLocations, setSelectedPl, project]);

  return (
    <>
      {project ? <GetProjectMeta {...ProjectProps} /> : null}
      {initialized ? (
        project && initialized ? (
          <>
            <SingleProjectDetails {...ProjectProps} />
          </>
        ) : (
          <></>
        )
      ) : null}
      <Credits setCurrencyCode={setCurrencyCode} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
