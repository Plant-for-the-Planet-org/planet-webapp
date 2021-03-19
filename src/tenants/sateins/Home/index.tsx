import { Modal } from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import DonationsPopup from '../../../features/donations'
import { ThemeContext } from '../../../theme/themeContext'
import { getRequest } from '../../../utils/apiRequests/api'
import getStoredCurrency from '../../../utils/countryCurrency/getStoredCurrency'
import FeaturesSection from './components/FeaturesSection'
import LandingSection from './components/LandingSection'
import styles from './styles/sateins.module.scss'
import LeaderBoard from '../../common/LeaderBoard'

interface Props {
    leaderboard: any,
    tenantScore: any
}

function Home({ leaderboard, tenantScore }: Props): ReactElement {
    const router = useRouter()
    const projectID = 'yucatan-reforestation';

    const LandingSectionData = {
        mainTitleSubText: 'EIN EURO = EIN BAUM',
        para: <span>Gemeinsam mit den Zuschauer*innen möchte der Sender SAT.1 rekordverdächtig viele Bäume pflanzen. Schon ein Euro genügt, um den neuen Wald auf der mexikanischen Halbinsel Yucatán wachsen zu lassen.</span>,
        imagePath: '/tenants/sateins/images/alhambra.jpg'
    }

    const FeaturesSectionData = {
        featureText: <div>
            <h2>Das Projekt</h2>
            <p>Für jeden gespendeten Euro im Rahmen der &quot;SAT.1 Waldrekord-Woche&quot; wird ein Baum gepflanzt. Aktionspartner Plant-for-the-Planet sorgt dafür, dass auf einer festgelegten Fläche auf der mexikanischen Halbinsel Yucatán im Bundesland Campeche der &quot;SAT.1-Wald&quot; gepflanzt wird - und pflegt die gespendeten Bäume, bis sie groß genug sind, um selbst weiter zu wachsen. Die Spender*innen können die Entwicklung ihrer Bäume auf der &quot;Plant-for-the-Planet&quot;-App verfolgen oder die Pflanzung persönlich besuchen.</p>
        </div>
    }

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

    const { theme } = React.useContext(ThemeContext);

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleViewProject = () => {
        if (window !== undefined) {
            router.push('/[p]', `/${project.slug}`, {
                shallow: true,
            });
        }
    }

    return project ? (
        <div className={styles.pageContainer}>
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
            <LandingSection tenantScore={tenantScore} handleViewProject={handleViewProject} handleOpen={handleOpen} LandingSectionData={LandingSectionData} />
            <LeaderBoard leaderboard={leaderboard} />
            <FeaturesSection FeaturesSectionData={FeaturesSectionData} />
            <p className={styles.poweredByLink}>Powered by <a href="https://a.plant-for-the-planet.org/de" target="_blank" rel="noreferrer">Plant-for-the-Planet</a> • <a href="https://a.plant-for-the-planet.org/de/imprint" target="_blank" rel="noreferrer">Impressum</a> • <a href="https://a.plant-for-the-planet.org/de/privacy-terms" target="_blank" rel="noreferrer">Datenschutz</a> </p>
        </div>
    ) : <></>
}


export default Home
