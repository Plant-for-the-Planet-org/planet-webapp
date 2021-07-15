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
import { getAllPlantLocations } from '../../src/utils/maps/plantLocations';

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
    setPlantLocations,
    selectedLocation,
    setSelectedLocation,
    setZoomLevel,
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    setZoomLevel(3);
    setSelectedLocation(null);
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
      fetchPlantLocation(project.id);
    }
  }
  async function fetchPlantLocation(id: any) {
    console.log('in fetch');
    const plantLocations = await getAllPlantLocations(id);
    setPlantLocations(plantLocations);
    const result = await getRequest(
      `/treemapper/plantLocations/${router.query.id}?_scope=extended`
    );
    if (result) {
      setSelectedLocation(result);
    } else {
      router.replace(`/${project.slug}`);
    }
  }

  React.useEffect(() => {
    setShowSingleProject(true);
    if (!selectedLocation) {
      if (router.query.p) {
        if (project) {
          if (project.slug === router.query.p && router.query.id) {
            fetchPlantLocation(project.id);
          } else {
            fetchProject();
          }
        } else {
          fetchProject();
        }
      }
    }
  }, [router, currencyCode, project, selectedLocation]);

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
      {project && initialized ? (
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
      )}
      <Credits setCurrencyCode={setCurrencyCode} />
    </>
  );
}
