import React, { ReactElement } from 'react'
import TreeDonation from './screens/TreeDonation'
import ContactDetails from './screens/ContactDetails'
import PaymentDetails from './screens/PaymentDetails'
import ThankYou from './screens/ThankYou'
import Projects from './screens/Projects'
import ProjectDetails from './screens/ProjectDetails'
import dynamic from 'next/dynamic'


const MapLayout = dynamic(
    () => import('./screens/Maps'),
    { ssr: false,loading: () => <p>Loading...</p> }
  )
interface Props {
    projects:any
}

function Donate({projects}: Props): ReactElement {
    const ProjectsProps = {
        projects : projects
      }
    return (
        <>
            <MapLayout/>
            <Projects {...ProjectsProps} />
        </>
    )
}

export default Donate
