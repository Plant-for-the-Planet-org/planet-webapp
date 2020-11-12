import React from 'react'
import Footer from '../../common/Layout/Footer'
import LandingSection from '../../common/Layout/LandingSection'
import styles from './Redeem.module.scss';
import { useSession, signIn, signOut } from 'next-auth/client';
import MapGL, {
    Marker,
    Popup,
    WebMercatorViewport,
  } from 'react-map-gl';
interface Props {
    
}

const Redeem = (props: Props) => {

    const [session, loading] = useSession();
    const isGift= false;
    const byOrg= false;
    const isPlanted = true;

    const isMobile = window.innerWidth <= 767;
    const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
    const defaultZoom = isMobile ? 1 : 1.4;
    const [viewport, setViewPort] = React.useState({
        width: Number('100%'),
        height: Number('100%'),
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: defaultZoom,
      });
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
                <MapGL
                    {...viewport}
                    mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
                    // onViewportChange={_onViewportChange}
                    mapStyle={'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7'}
                >
                 </MapGL>
                </div>

                <div className={styles.plantedGiftMessage}>
                    {isGift ? 'Felix gifted you 5 trees! Your trees are being planted in Yucatan, Mexico '  : byOrg ? 'Congratulations on your 5 trees from Salesforce! Your trees are being planted in Yucatan, Mexico': 'You’ve planted X trees!'}
                </div>
                {!byOrg && !session ? (
                    <div className={styles.signupMessage}>
                        {isPlanted ?  'These trees have already been added to an account.':'Sign up to keep track of your trees as they grow – and maybe even plant more trees yourself.'}
                    </div>
                ) :null}

                {!byOrg && !session ? (
                    <div className={styles.authButtonsContainer}>
                        <div className={styles.authButton}>
                            Sign Up
                        </div>
                        <div className={styles.authButton}>
                            Log in
                        </div>
                    </div>
                ) : !isPlanted ? (
                    <div className={styles.authButtonsContainer}>
                        <div className={styles.authButton}>
                            Add to my profile
                        </div>
                    </div>
                ) : null
                }
                
            </div>
           
        </div>
        <Footer/>
        </>
    )
}

export default Redeem
