import type {
  SiteViewPort,
  SitesGeoJSON,
  ViewPort,
} from '../../features/common/types/ProjectPropsContextInterface';
import type { SetState } from '../../features/common/types/common';

import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import bbox from '@turf/bbox';

export default function zoomToProjectSite(
  geoJson: SitesGeoJSON | null,
  selectedSite: number,
  viewport: ViewPort,
  setViewPort: SetState<ViewPort>,
  setSiteViewPort: SetState<SiteViewPort | null>,
  duration = 1200
) {
  if (viewport.width && viewport.height && geoJson) {
    // decide which paddings to use (for mobile or normal)
    let isPortrait = true;
    if (screen.orientation) {
      isPortrait =
        screen.orientation.angle === 0 || screen.orientation.angle === 180;
    } else if (window.orientation) {
      isPortrait = window.orientation === 0 || window.orientation === 180;
    }
    const isMobile = window.innerWidth <= 767 && isPortrait;
    //console.log("zoomToProjectSite", viewport, viewport.width, window.innerWidth, viewport.height, window.innerHeight);

    const bounds = bbox(geoJson.features[selectedSite]);

    const { longitude, latitude, zoom } = new WebMercatorViewport(
      viewport
    ).fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      {
        padding: {
          top: 50,
          bottom: isMobile ? 300 : 50,
          left: isMobile ? 50 : 400,
          right: isMobile ? 50 : 100,
        },
      }
    );
    let defaultZoom = 15;
    if (zoom < defaultZoom) {
      defaultZoom = zoom;
    }
    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom: defaultZoom,
      transitionDuration: duration,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
    };

    setViewPort(newViewport);
    setSiteViewPort({ center: [longitude, latitude], zoom: defaultZoom });
  } else {
    const newViewport = {
      ...viewport,
      height: window.innerHeight,
      width: window.innerWidth,
    };
    setViewPort(newViewport);
  }
}
