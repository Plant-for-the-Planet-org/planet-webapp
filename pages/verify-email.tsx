import React, { ReactElement } from 'react'
import Footer from '../src/features/common/Layout/Footer'
import LandingSection from '../src/features/common/Layout/LandingSection'
import VerifyEmailComponent from './../src/features/common/VerifyEmail/VerifyEmail'

interface Props {

}

function VerifyEmail({ }: Props): ReactElement {

    return (
        <div>
            <LandingSection>
                <VerifyEmailComponent />
            </LandingSection>

            <Footer />
        </div>
    )
}

export default VerifyEmail
