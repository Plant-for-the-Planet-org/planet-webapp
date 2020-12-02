import React, { ReactElement } from 'react'
import Footer from '../src/features/common/Layout/Footer'
import VerifyEmailComponent from './../src/features/common/VerifyEmail/VerifyEmail'

interface Props {

}

function VerifyEmail({ }: Props): ReactElement {
    

    return (
        <div>
            <VerifyEmailComponent />
            <Footer />
        </div>
    )
}

export default VerifyEmail
