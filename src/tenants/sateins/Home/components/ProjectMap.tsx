import React, { ReactElement } from 'react'
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import styles from './../styles/anilloverdegranada.module.scss'

interface Props {
    projectID:String;
}

function ProjectMap({projectID}: Props): ReactElement {
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
    return project ? (
        <div className={styles.projectMapContainer}>
            <ProjectSnippet project={project} key={1} editMode={false} />
        </div>
    ): <></>
}

export default ProjectMap
