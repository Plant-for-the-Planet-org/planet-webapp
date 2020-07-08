import React, { ReactElement } from 'react'
import ProjectSnippet from './ProjectSnippet'

interface Props {
    
}

function AllProjects({}: Props): ReactElement {
    return (
        <div>
            <ProjectSnippet/>
            <ProjectSnippet/>
        </div>
    )
}

export default AllProjects
