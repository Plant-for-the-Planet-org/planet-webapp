import React from 'react';
import Footer from '../../common/Layout/Footer';
import LandingSection from '../../common/Layout/LandingSection';
import styles from './Redeem.module.scss';
import { useAuth0 } from '@auth0/auth0-react';
import MapGL, { Marker, Popup, WebMercatorViewport } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
interface Props {
  slug: string;
}

const Redeem = ({ slug }: Props) => {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();

  const isGift = false;
  const byOrg = false;
  const isPlanted = true;
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const defaultMapCenter = [20.9802115, -89.702959];
  const defaultZoom = 7;
  const [viewport, setViewPort] = React.useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [mapState, setMapState] = React.useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 15,
  });

  React.useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  const _onStateChange = (state: any) => setMapState({ ...state });

  return (
    <>
      <div className={styles.redeem}>
        <LandingSection
          imageSrc={
            'https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg'
          }
        ></LandingSection>
        <div className={styles.redeemContainer}>
          <h2 className={styles.redeemUserName}>Hi Paulina!</h2>

          <div className={styles.mapContainer}>
            <MapGL {...viewport} {...mapState} onStateChange={_onStateChange}>
              <Marker latitude={20.9802115} longitude={-89.702959}>
                <div className={styles.marker}>500 Trees</div>
              </Marker>
            </MapGL>
          </div>

          <div className={styles.plantedGiftMessage}>
            {isGift
              ? 'Felix gifted you 5 trees! Your trees are being planted in Yucatan, Mexico '
              : byOrg
              ? 'Congratulations on your 5 trees from Salesforce! Your trees are being planted in Yucatan, Mexico'
              : 'You’ve planted X trees!'}
          </div>
          {!byOrg && !isAuthenticated ? (
            <div className={styles.signupMessage}>
              {isPlanted
                ? 'These trees have already been added to an account.'
                : 'Sign up to keep track of your trees as they grow – and maybe even plant more trees yourself.'}
            </div>
          ) : null}

          {!byOrg && !isAuthenticated ? (
            <div className={styles.authButtonsContainer}>
              <div
                onClick={() =>
                  loginWithRedirect({
                    redirectUri: `${process.env.NEXTAUTH_URL}/login`,
                    ui_locales: localStorage.getItem('language') || 'en',
                  })
                }
                className={styles.authButton}
              >
                Sign Up
              </div>
              <div
                onClick={() =>
                  loginWithRedirect({
                    redirectUri: `${process.env.NEXTAUTH_URL}/login`,
                    ui_locales: localStorage.getItem('language') || 'en',
                  })
                }
                className={styles.authButton}
              >
                Log in
              </div>
            </div>
          ) : !isPlanted ? (
            <div className={styles.authButtonsContainer}>
              <div className={styles.authButton}>Add to my profile</div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Redeem;
