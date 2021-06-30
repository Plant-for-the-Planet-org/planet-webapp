import { Modal } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { ProjectPropsContext } from '../../src/features/common/Layout/ProjectPropsContext';
import DonationsPopup from '../../src/features/donations';
import Credits from '../../src/features/projects/components/maps/Credits';
import SinglePlantLocation from '../../src/features/projects/screens/SinglePlantLocation';
import { ThemeContext } from '../../src/theme/themeContext';
import { getRequest } from '../../src/utils/apiRequests/api';
import getStoredCurrency from '../../src/utils/countryCurrency/getStoredCurrency';
import GetProjectMeta from '../../src/utils/getMetaTags/GetProjectMeta';

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
  const [open, setOpen] = React.useState(false);
  const { theme } = React.useContext(ThemeContext);
  const {
    project,
    setProject,
    setShowSingleProject,
    plantLocations,
    setPlantLocations,
    selectedLocation,
    setSelectedLocation,
    setZoomLevel,
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    setZoomLevel(3);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  async function fetchProject() {
    if (!internalCurrencyCode || currencyCode !== internalCurrencyCode) {
      const currency = getStoredCurrency();
      setInternalCurrencyCode(currency);
      setCurrencyCode(currency);
      const project = await getRequest(
        `/app/projects/${router.query.p}?_scope=extended&currency=${currency}`
      );
      setProject(project);
      fetchPlantLocation();
    }
  }
  async function fetchPlantLocation() {
    if (plantLocations && plantLocations.length !== 0) {
      for (const key in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
          const element = plantLocations[key];
          if (element.id === router.query.id) {
            setSelectedLocation(element.id);
            setZoomLevel(3);
            break;
          } else {
            setSelectedLocation(null);
          }
        }
      }
      if (selectedLocation === '') router.replace(`/${project.slug}`);
    } else {
      const result = await getRequest(
        `/treemapper/plantLocations/${router.query.id}`
      );
      if (result) {
        setSelectedLocation(result[0]);
      } else {
        router.replace(`/${project.slug}`);
      }
    }
  }

  React.useEffect(() => {
    setShowSingleProject(true);
    if (router.query.p) {
      if (project) {
        if (project.slug === router.query.p && router.query.id) {
          fetchPlantLocation();
        } else {
          fetchProject();
        }
      } else {
        fetchProject();
      }
    }
  }, [router, currencyCode, project]);

  const ProjectProps = {
    project,
    currencyCode,
    setCurrencyCode,
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
        selectedLocation && initialized ? (
          <>
            <SinglePlantLocation {...ProjectProps} />
            <Modal
              className={`modalContainer ${theme}`}
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              disableBackdropClick
            >
              <DonationsPopup project={project} onClose={handleClose} />
            </Modal>
          </>
        ) : (
          <></>
        )
      ) : null}
      <Credits setCurrencyCode={setCurrencyCode} />
    </>
  );
}
