import React, { ReactElement } from 'react'
import TreeDonation from './screens/TreeDonation'
import ContactDetails from './screens/ContactDetails'
import PaymentDetails from './screens/PaymentDetails'
import ThankYou from './screens/ThankYou'
import Projects from './screens/Projects'
import ProjectDetails from './screens/ProjectDetails'

interface Props {
    projects:any
}

function Donate({projects}: Props): ReactElement {
    const ProjectsProps = {
        projects : projects
      }
    return (
        <>
            <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            <Projects {...ProjectsProps} />
            </div>
        </>
    )
}

export default Donate
