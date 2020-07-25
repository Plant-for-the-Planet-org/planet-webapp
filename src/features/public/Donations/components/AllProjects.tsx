import React, { ReactElement } from 'react'
import dynamic from 'next/dynamic'

const ProjectSnippet = dynamic(
  () => import('./ProjectSnippet'),
  { loading: () => <p>Loading...</p> }
)
interface Props {
    projects:any
}

function AllProjects({projects}: Props): ReactElement {

    return (
        <div>
             {
                projects.map((project: any) => {
                    return(
                        <ProjectSnippet key={project.properties.id} project={project} />
                    )
                })
            }
        </div>
    )
}

export default AllProjects
