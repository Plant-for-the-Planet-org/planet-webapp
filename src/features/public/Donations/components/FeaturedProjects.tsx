import React, { ReactElement } from 'react'
import ProjectSnippet from './ProjectSnippet'

interface Props {
    
}

function FeaturedProjects({}: Props): ReactElement {
    return (
        <div>
            <ProjectSnippet/>
            <ProjectSnippet/>
            <ProjectSnippet/>
        </div>
    )
}

export default FeaturedProjects
