import { useRouter } from 'next/router';
import React from 'react';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import { ProjectPropsContext } from '../src/features/common/Layout/ProjectPropsContext';
import Credits from '../src/features/projects/components/maps/Credits';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
import { ThemeContext } from '../src/theme/themeContext';
import { getRequest } from '../src/utils/apiRequests/api';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import { getAllPlantLocations } from '../src/utils/maps/plantLocations';
import i18next from '../i18n';
import { ParamsContext } from '../src/features/common/Layout/QueryParamsContext';

const { useTranslation } = i18next;
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
  const { theme } = React.useContext(ThemeContext);
  const { tenantID } = React.useContext(ParamsContext);
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
        internalLanguage !== i18n.language ||
        tenantID
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
          },
          undefined,
          tenantID
        );
        setProject(project);
        setShowSingleProject(true);
        setZoomLevel(2);
      }
    }
    if (router.query.p && tenantID) {
      loadProject();
    }
  }, [tenantID, router.query.p, currencyCode, i18n.language]);

  React.useEffect(() => {
    async function loadPl() {
      setPlantLocationsLoaded(false);
      const newPlantLocations = await getAllPlantLocations(
        project.id,
        handleError,
        tenantID
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
