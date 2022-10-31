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
    project,
    setProject,
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

  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const { handleError } = React.useContext(ErrorHandlingContext);

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
        const project = await getRequest(
          `/app/projects/${router.query.p}`,
          handleError,
          '/',
          {
            _scope: 'extended',
            currency: currency,
            locale: i18n.language,
          }
        );
        setProject(project);
        setShowSingleProject(true);
        setZoomLevel(2);
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
        handleError
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
    if (localStorage.getItem('i18nextLng') !== null && i18n) {
      const languageFromLocalStorage: any = localStorage.getItem('i18nextLng');
      i18n.changeLanguage(languageFromLocalStorage);
    }
  }, [i18n]);

  React.useEffect(() => {
    if (router.asPath) {
      const isDonation = router.asPath.search('#donate');
      if (isDonation && isDonation != -1) {
        handleOpen();
      }
    }
  }, [router.asPath]);
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
          'donation',
          'editProfile',
          'leaderboard',
          'managePay',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTree',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
