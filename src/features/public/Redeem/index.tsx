import React from 'react'
import Footer from '../../common/Layout/Footer'
import LandingSection from '../../common/Layout/LandingSection'
import styles from './Redeem.module.scss'
interface Props {
    
}

const Redeem = (props: Props) => {
    const isGift= false;
    const byOrg= true;
    const isPlanted = true;
    return (
        <>
        <div className={styles.redeem}>
            <LandingSection imageSrc={
                process.env.CDN_URL
                    ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
                    : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
                }>
            

            </LandingSection>
            <div className={styles.redeemContainer}>
                <h2 className={styles.redeemUserName}>Hi Paulina!</h2>

                <div className={styles.mapContainer}>

                </div>

                <div className={styles.plantedGiftMessage}>
                    {isGift ? 'Felix gifted you 5 trees! Your trees are being planted in Yucatan, Mexico '  : byOrg ? 'Congratulations on your 5 trees from Salesforce! Your trees are being planted in Yucatan, Mexico': 'You’ve planted X trees!'}
                </div>
                {!byOrg ? (
                    <div className={styles.signupMessage}>
                        {isPlanted ?  'These trees have already been added to an account.':'Sign up to keep track of your trees as they grow – and maybe even plant more trees yourself.'}
                    </div>
                ) :null}

{!byOrg ? (
                
                <div className={styles.authButtonsContainer}>
                    <div className={styles.authButton}>
                        Sign Up
                    </div>
                    <div className={styles.authButton}>
                        Log in
                    </div>
                </div>

) :null}
                <div className={styles.authButtonsContainer}>
                    <div className={styles.authButton}>
                        Add to my profile
                    </div>
                </div>
            </div>
           
        </div>
        <Footer/>
        </>
    )
}

export default Redeem
