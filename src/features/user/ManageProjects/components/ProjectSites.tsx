import React, { ReactElement } from 'react';
import styles from './../styles/StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import StaticMap, { Source, Layer } from 'react-map-gl';

const { useTranslation } = i18next;
const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;
interface Props {
  handleNext: Function;
  handleBack: Function;
}

const Map = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ProjectSites({
  handleBack,
  handleNext,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);

  const { register, handleSubmit, errors } = useForm();

  const [siteDetails, setSiteDetails] = React.useState({});

  const changeSiteDetails = (e: any) => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    width: 700,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const onSubmit = (data: any) => {
    handleNext();
  };

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  return (
    <div className={styles.stepContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div className={styles.formFieldLarge}>
          <StaticMap
            {...viewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle={'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7'}
            onViewportChange={_onViewportChange}
            dragPan={false}
            dragRotate={false}
            touchRotate={false}
            doubleClickZoom={false}
            scrollZoom={false}
            touchZoom={false}
          ></StaticMap>
        </div> */}
        <div className={styles.formFieldLarge}>
          <MaterialTextField
            inputRef={register({ required: true })}
            label={t('manageProjects:siteName')}
            variant="outlined"
            name="siteName"
            onChange={changeSiteDetails}
            // defaultValue={}
          />
        </div>
        <Map />

        <div className={styles.formFieldLarge}>
          <p className={styles.inlineLinkButton}>Add another site</p>
        </div>

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={handleBack}
              className={styles.secondaryButton}
            >
              <BackArrow />
              <p>Back to detailed analysis</p>
            </AnimatedButton>
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={onSubmit}
              className={styles.continueButton}
            >
              {'Save & continue'}
            </AnimatedButton>
          </div>
        </div>
      </form>
    </div>
  );
}
