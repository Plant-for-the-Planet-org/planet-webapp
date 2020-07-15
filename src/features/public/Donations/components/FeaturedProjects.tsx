import React, { ReactElement } from 'react'
import ProjectSnippet from './ProjectSnippet'

interface Props {
    projects:any
}

function FeaturedProjects({projects}: Props): ReactElement {

    return (
        <div>
            {
                projects.map((project: any) => {
                    return(
                        <ProjectSnippet project={project} />
                    )
                })
            }
            
        </div>
    )
}

export default FeaturedProjects
