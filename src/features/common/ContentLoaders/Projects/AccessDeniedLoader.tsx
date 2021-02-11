import React, { ReactElement } from 'react'
import AccessDenied from '../../../../../public/assets/images/icons/manageProjects/AccessDenied'

interface Props {
    
}

function AccessDeniedLoader({}: Props): ReactElement {
    return (
        <div
        style={{height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}
      >
          <AccessDenied width={'320px'} height={'229px'} />
          <h2 style={{marginTop:'24px',fontWeight:'bold',fontSize:'30px'}}>You don’t have access to this page</h2>
      </div>
    )
}

export default AccessDeniedLoader
