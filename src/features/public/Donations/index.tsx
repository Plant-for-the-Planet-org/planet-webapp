import React, { ReactElement } from 'react'
import TreeDonation from './screens/TreeDonation'
import ContactDetails from './screens/ContactDetails'
import PaymentDetails from './screens/PaymentDetails'

interface Props {
    
}

function Donate({}: Props): ReactElement {
    return (
        <div style={{backgroundColor:'#2F3336',padding:'24px',display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
            {/* <TreeDonation/>
            <ContactDetails/> */}
            <PaymentDetails/>
        </div>
    )
}

export default Donate
