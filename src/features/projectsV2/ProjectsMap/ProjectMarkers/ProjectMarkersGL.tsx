import type { MapProject } from '../../../common/types/projectv2';
import type { FeatureCollection, Point } from 'geojson';
import type { MapLayerMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl-v7/maplibre';
import { useRouter } from 'next/router';
import ProjectPopup from '../ProjectPopup';
import {
  getPointMarkerImageKey,
  registerMarkerIcons,
  MARKER_ICON_OFFSET_Y,
} from './markerImageRegistry';
import { getProjectCategory } from '../../../../utils/projectV2';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useQueryParamStore } from '../../../../stores/queryParamStore';

interface Props {
  projects: MapProject[];
  page: 'project-list' | 'project-details';
}

export const PROJECT_MARKERS_LAYER = 'project-markers-gl';

// Draw order by tier: lower value renders first (underneath). Top projects on top, non donatable at bottom
const TIER_DRAW_ORDER: Record<string, number> = {
  nonDonatableProject: 0,
  regularProject: 1,
  topProject: 2,
};

type ProjectMarkerProperties = {
  id: string;
  slug: string;
  iconKey: string;
  sortKey: number;
};

const ProjectMarkersGL = ({ projects, page }: Props) => {
  const { current: mapInstance } = useMap();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');
  const callbackUrl = useQueryParamStore((state) => state.callbackUrl);

  const { featureCollection, projectById } = useMemo(() => {
    const projectById = new Map<string, MapProject>();
    const features = projects
      .map((project) => {
        const iconKey = getPointMarkerImageKey(project.properties);
        if (!iconKey) return null;
        projectById.set(project.properties.id, project);
        return {
          type: 'Feature' as const,
          geometry: project.geometry,
          properties: {
            id: project.properties.id,
            slug: project.properties.slug,
            iconKey,
            sortKey:
              TIER_DRAW_ORDER[getProjectCategory(project.properties)] ?? 0,
          } as ProjectMarkerProperties,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);
    return {
      featureCollection: {
        type: 'FeatureCollection',
        features,
      } as FeatureCollection<Point, ProjectMarkerProperties>,
      projectById,
    };
  }, [projects]);

  const visitProject = useCallback(
    (projectSlug: string): void => {
      const searchParams = new URLSearchParams();
      if (isEmbedMode) {
        searchParams.set('embed', 'true');
        if (typeof callbackUrl === 'string') {
          searchParams.set('callback', callbackUrl);
        }
      }
      const queryString = searchParams.toString();
      const path = `/${projectSlug}${queryString ? `?${queryString}` : ''}`;
      router.push(localizedPath(path));
    },
    [localizedPath, isEmbedMode, callbackUrl, router]
  );

  // Register the per-category pin images on the map (idempotent).
  useEffect(() => {
    const map = mapInstance?.getMap();
    if (!map) return;
    let cancelled = false;
    const registerIcons = () => {
      if (!cancelled) void registerMarkerIcons(map);
    };
    if (map.isStyleLoaded()) registerIcons();
    else map.once('load', registerIcons);
    // Safety net: re-register if an icon is missing (e.g. after a style reload).
    // styleimagemissing fires once per missing image (~24 at initial load) - registerMarkerIcons coalesces concurrent calls so only one rasterization runs.
    map.on('styleimagemissing', registerIcons);
    return () => {
      cancelled = true;
      map.off('load', registerIcons);
      map.off('styleimagemissing', registerIcons);
    };
  }, [mapInstance]);

  // Hover/click interactions on the marker layer.
  const [popupProject, setPopupProject] = useState<MapProject | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    const map = mapInstance?.getMap();
    if (!map) return;

    const getProjectFromFeature = (
      f: MapGeoJSONFeature | undefined
    ): MapProject | undefined =>
      f
        ? projectById.get((f.properties as ProjectMarkerProperties).id)
        : undefined;

    const onMove = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer';
      const project = getProjectFromFeature(e.features?.[0]);
      if (!project) return;
      clearTimers();
      openTimer.current = setTimeout(() => {
        setPopupProject((prev) =>
          prev?.properties.id === project.properties.id ? prev : project
        );
      }, 300);
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = '';
      if (openTimer.current) clearTimeout(openTimer.current);
      closeTimer.current = setTimeout(() => setPopupProject(null), 200);
    };
    const onClick = (e: MapLayerMouseEvent) => {
      const project = getProjectFromFeature(e.features?.[0]);
      if (project) visitProject(project.properties.slug);
    };

    map.on('mousemove', PROJECT_MARKERS_LAYER, onMove);
    map.on('mouseleave', PROJECT_MARKERS_LAYER, onLeave);
    map.on('click', PROJECT_MARKERS_LAYER, onClick);
    return () => {
      map.off('mousemove', PROJECT_MARKERS_LAYER, onMove);
      map.off('mouseleave', PROJECT_MARKERS_LAYER, onLeave);
      map.off('click', PROJECT_MARKERS_LAYER, onClick);
    };
  }, [mapInstance, projectById, visitProject, clearTimers]);

  const handlePopupLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setPopupProject(null), 200);
  }, []);

  return (
    <>
      <Source
        id="project-markers-source"
        type="geojson"
        data={featureCollection}
      >
        <Layer
          id={PROJECT_MARKERS_LAYER}
          type="symbol"
          layout={{
            'icon-image': ['get', 'iconKey'],
            'icon-size': 1,
            'icon-anchor': 'bottom',
            'icon-offset': [0, MARKER_ICON_OFFSET_Y],
            'icon-allow-overlap': true,
            'symbol-sort-key': ['get', 'sortKey'],
          }}
        />
      </Source>
      {popupProject && (
        <ProjectPopup
          project={popupProject}
          handlePopupEnter={clearTimers}
          handlePopupLeave={handlePopupLeave}
          visitProject={visitProject}
          page={page}
        />
      )}
    </>
  );
};

export default ProjectMarkersGL;
