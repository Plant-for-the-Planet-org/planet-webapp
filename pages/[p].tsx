import { Modal } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { ProjectPropsContext } from '../src/features/common/Layout/ProjectPropsContext';
import DonationsPopup from '../src/features/donations';
import Credits from '../src/features/projects/components/maps/Credits';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
import { ThemeContext } from '../src/theme/themeContext';
import { getRequest } from '../src/utils/apiRequests/api';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import { getAllPlantLocations } from '../src/utils/maps/plantLocations';

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
    setZoomLevel,
    setPlantLocations,
    selectedPl,
    hoveredPl,
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    setZoomLevel(2);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    async function loadProject() {
      if (!internalCurrencyCode || currencyCode !== internalCurrencyCode) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        const project = await getRequest(
          `/app/projects/${router.query.p}?_scope=extended&currency=${currency}`
        );
        setProject(project);
        setShowSingleProject(true);
        setZoomLevel(2);
      }
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currencyCode]);

  React.useEffect(() => {
    async function loadPl() {
      const newPlantLocations = await getAllPlantLocations(project.id);
      setPlantLocations(newPlantLocations);
    }
    if (project) {
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
