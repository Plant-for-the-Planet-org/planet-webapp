import React, { ReactElement } from 'react'
import dynamic from 'next/dynamic'
import LazyLoad from 'react-lazyload';

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
            <LazyLoad>
             {
                projects.map((project: any) => {
                    return(
                        <ProjectSnippet key={project.properties.id} project={project} />
                    )
                })
            }
            </LazyLoad>
        </div>
    )
}

export default AllProjects
