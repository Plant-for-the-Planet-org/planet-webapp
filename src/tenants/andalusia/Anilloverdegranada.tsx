import { Modal } from '@material-ui/core'
import { Elements } from '@stripe/react-stripe-js'
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

function Anilloverdegranada({ }: Props): ReactElement {
    const projectID = 'proj_0CgTQJMm5zX624sdpVDet93O';

    const LandingSectionData = {
        mainTitleText:'200.000 árboles para Granada,',
        mainTitleSubText:'1 Billón para el planeta.',
        para: <span><b>Plant-for-the-Planet</b> propuso al Ayuntamiento de Granada en 2019 desarrollar el proyecto "Anillo verde de Granada" para crear un anillo natural reforestado que rodeará la ciudad.</span>,
        imagePath:'/tenants/andalusia/images/alhambra.jpg'
    }

    const FeaturesSectionData = {
        featureText:<div>
                        <span>Un pulmón para una de las ciudades más bellas de España</span>
                        <h2>El Anillo verde de Granada</h2>
                        <p>En aras de reverdecer la ciudad de la Alhambra, este proyecto pretende crear un nuevo ecosistema formado por especies autóctonas.</p>
                        <p>Dicho ecosistema se llevará a cabo mediante la restauración de bosques y otros paisajes en una superficie aproximada de 800 hectáreas por un periodo de al menos 50 años, garantizando su exención de venta o explotación comercial y protegidas durante ese período.</p>
                        <p>La creación de este Anillo verde persigue, por un lado, mitigar el calentamiento global y, por otro, velar por la salud de las generaciones actuales y futuras, a través de la mejora de la calidad del aire, la promoción de la actividad física o los diversos beneficios para el sistema inmunológico y el metabolismo.</p>
                        <p>El proyecto se dividirá en varias etapas desde este año 2020 hasta 2030. </p>
                    </div>,
        features:{
            title1:'El espacio',
            text1:'800 hectáreas (Granada)',
            title2:'Especies',
            text2:'Pinos, encinas & especies mediterráneas',
            title3:'Monte público',
            text3:'Monte público - Cesión por el Ayuntamiento de Granada',
            title4:'Coordenadas',
            text4:'37.203275, -3.588959'
        }
    }

    const SustainableCityData = {
        sustainableText: <div><h2>Si amas Granada...</h2>
        <h3>Si deseas formar parte de su presente y futuro...</h3>
        <h3 style={{color:'#568802'}}>Si quieres ayudar a crear una ciudad más verde y sostenible</h3></div>,
        imagePath:'/tenants/andalusia/images/sustainableCity.jpg'
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
            <LandingSection handleOpen={handleOpen} LandingSectionData={LandingSectionData} />
            <Objective />
            <FeaturesSection FeaturesSectionData={FeaturesSectionData} />
            {/* <ProjectMap projectID={projectID} /> */}
            <SustainableCity handleOpen={handleOpen} SustainableCityData={SustainableCityData} />
            <ProjectBy/>
            
            <Footer/>
        </div>
    ): <></>
}


export default Anilloverdegranada
