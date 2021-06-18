import React from 'react'
import styles from './../styles/TreeCounter.module.scss';
import TreeProfile from './../../TreeCounter/TreeCounter';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../../../../utils/apiRequests/api';
import { Modal } from '@material-ui/core';
import DonationsPopup from '../../../../features/donations';
import { ThemeContext } from '../../../../theme/themeContext';
interface Props {
  tenantScore: any;
}
export default function TreeCounterSection(tenantScore: Props) {
  const tenantScoreData = tenantScore.tenantScore
    ? tenantScore.tenantScore.total
    : '';

    const projectID = 'yucatan';

    const [project, setProject] = React.useState(null)
    React.useEffect(() => {
        async function loadProject() {
            const currencyCode = getStoredCurrency();
            const project = await getRequest(`/app/projects/${projectID}?_scope=extended&currency=${currencyCode}`);
            setProject(project);
        }
        if (projectID) {
            loadProject();
        }
    }, [projectID]);

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const { theme } = React.useContext(ThemeContext);

  return (
    <div className={styles.treeCounterSectionContainer}>
      <Modal
                className={`modal ${theme} modalContainer`}
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableBackdropClick
                hideBackdrop
            >
                <DonationsPopup project={project} onClose={handleClose} />
            </Modal>
      <div className={`${styles.treeCounterSectionRow}`}>
        <div
          className={`${styles.treeCounterSectionText}`}
        >
          <h2 className={styles.treeCounterSectionTextHeader}>
            GLOBAL PARLI
          </h2>
          <br />
          <p className={styles.treeCounterSectionTextPara}>
            1 lakh + per acre income of Indian Farmers.
            <br/>
            Goal is to plant 70 million saplings which will grow not only into fruit bearing trees but also grow the incomes of the farmers.
          </p>
          <button onClick={handleOpen} className={'primaryButton'} style={{ width: '320px' }}>
            Donate now
          </button>
        </div>
        <div
          className={`${styles.treeCounterSection}`}
        >
          <div className={styles.treeCounter}>
            <TreeProfile target={7000000} planted={5230000} />
          </div>
        </div>
      </div>
    </div>
  );
}
