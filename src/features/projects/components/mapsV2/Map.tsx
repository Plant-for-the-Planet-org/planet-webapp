import MapGL from 'react-map-gl';
import { useState, useContext, useRef, useEffect } from 'react';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import {
  ViewPort,
  MapState,
} from '../../../common/types/ProjectPropsContextInterface';
import { MapRef } from 'react-map-gl/src/components/static-map';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import styles from './styles/Map.module.scss';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import { MapProject } from '../../../common/types/ProjectPropsContextInterface';
import { useTranslation } from 'next-i18next';
import { useTenant } from '../../../common/Layout/TenantContext';
import Home from './HomePage/Home';
import { PopupData } from '../maps/Markers';

const LandingPageMap = () => {
  const { embed, showProjectList } = useContext(ParamsContext);
  const { tenantConfig } = useTenant();
  const mapRef = useRef<MapRef>(null);
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<MapProject[]>([]);

  const isEmbed = embed === 'true' && showProjectList === 'false';
  const defaultMapCenter: [number, number] = isMobile
    ? isEmbed
      ? [22.54, 0]
      : [22.54, 9.59]
    : isEmbed
    ? [36.96, 0]
    : [36.96, -28.5];
  const defaultZoom: number = isMobile ? 1 : 1.4;
  const [viewport, setViewPort] = useState<ViewPort>({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = useState<MapState>({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });

  const _onStateChange = (state: any) => setMapState({ ...state });
  const _onViewportChange = (view: any) => setViewPort({ ...view });

  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  useEffect(() => {
    const getAllProjects = async () => {
      const currency = getStoredCurrency();
      try {
        const projects = await getRequest<MapProject[]>(
          `${tenantConfig.id}`,
          `/app/projects`,
          {
            _scope: 'map',
            currency: currency,
            tenant: `${tenantConfig.id}`,
            'filter[purpose]': 'trees,conservation',
            locale: i18n.language,
          }
        );
        setProjects(projects);
      } catch (error) {
        console.log('error');
      }
    };
    getAllProjects();
  }, []);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewportChange={_onViewportChange}
        onViewStateChange={_onStateChange}
        height={'100%'}
        width={'100%'}
      >
        <Home
          searchedProject={projects}
          isMobile={isMobile}
          defaultMapCenter={defaultMapCenter}
          viewport={viewport}
          setViewPort={setViewPort}
          defaultZoom={defaultZoom}
        />
      </MapGL>
    </div>
  );
};

export default LandingPageMap;
