import React, { ReactElement } from 'react'
import TreeDonation from './screens/TreeDonation'
import ContactDetails from './screens/ContactDetails'
import PaymentDetails from './screens/PaymentDetails'
import ThankYou from './screens/ThankYou'
import Projects from './screens/Projects'
import ProjectDetails from './screens/ProjectDetails'

interface Props {
    
}

function Donate({}: Props): ReactElement {
    return (
        <>
        <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            {/* <ProjectDetails/> */}
        </div>
        <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            {/* <Projects/> */}
        </div>
        <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            <TreeDonation/>
        </div>
        <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            <ContactDetails/> 
        </div>
        <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            <PaymentDetails/>
        </div>
        <div style={{backgroundColor:'#2F3336',display:'flex',justifyContent:'center',padding:'2em'}}>
            <ThankYou/>
        </div>
        </>
    )
}

export default Donate
