import { Modal } from '@material-ui/core'
import { Elements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import Footer from '../../features/common/Layout/Footer'
import DonationsPopup from '../../features/donations'
import { ThemeContext } from '../../theme/themeContext'
import { getRequest } from '../../utils/apiRequests/api'
import getStoredCurrency from '../../utils/countryCurrency/getStoredCurrency'
import getStripe from '../../utils/stripe/getStripe'
import FeaturesSection from './components/FeaturesSection'
import LandingSection from './components/LandingSection'
import Objective from './components/Objective'
import ProjectBy from './components/ProjectBy'
import ProjectMap from './components/ProjectMap'
import SustainableCity from './components/SustainableCity'
import styles from './styles/anilloverdegranada.module.scss'

interface Props {

}

function Andodonana({ }: Props): ReactElement {
    const router = useRouter()
    const projectID = 'proj_0CgTQJMm5zX624sdpVDet93O';

    const LandingSectionData = {
        mainTitleText:'600.000 árboles para Doñana,',
        mainTitleSubText:'1 Billón para el planeta.',
        para: <span>Un proyecto destinado a la recuperación del ecosistema del Parque Natural de Doñana después del incendio del año 2017 en la zona del Pinar de las Peñuelas (Mazagón, Huelva).</span>,
        imagePath:'/tenants/andalucia/images/andodonana.jpg'
    }

    const FeaturesSectionData = {
        featureText:<div>
                        <span>Recuperando el ecosistema</span>
                        <h2>Después del incendio de 2017</h2>
                        <p>Esta iniciativa nace con el objetivo de reforestar una zona de aproximadamente 9.000 ha en el pinar de Las Peñuelas, en el Parque Natural de Doñana, se articula a través de un convenio de colaboración entre la Dirección General de Medio Natural, Biodiversidad y Espacios Protegidos de la Junta de Andalucía, responsable de la gestión del Parque Nacional de Doñana y la Fundación Plant-for-the-Planet España, para la restauración del ecosistema </p>
                    </div>,
        features:{
            title1:'El espacio',
            text1:'Se reforestará una zona de 9.000 ha. (Huelva) ',
            title2:'Especies',
            text2:'Pinos, encinas & especies mediterráneas ',
            title3:'Monte público',
            text3:'Acuerdo con Parque Natural de Doñana',
            title4:'Coordenadas',
            text4:'36.971337,-6.450786'
        }
    }



    const [project,setProject] = React.useState(null)
    React.useEffect(() => {
        async function loadProject() {
          let currencyCode = getStoredCurrency();
          const project = await getRequest(`/app/projects/${projectID}?_scope=extended&currency=${currencyCode}`);
          setProject(project);
        }
        if(projectID) {
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

    const handleViewProject=()=>{
        if( window!== undefined){
            router.push('/[p]', `/${project.slug}`, {
                shallow: true,
              });
        }
    }

    return  project ? (
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
                <Elements stripe={getStripe()}>
                    <DonationsPopup project={project} onClose={handleClose} />
                </Elements>
            </Modal>
            <LandingSection handleViewProject={handleViewProject} handleOpen={handleOpen} LandingSectionData={LandingSectionData} />
            <Objective />
            <FeaturesSection FeaturesSectionData={FeaturesSectionData} />
            <ProjectBy/>
            
            <Footer/>
        </div>
    ): <></>
}


export default Andodonana
