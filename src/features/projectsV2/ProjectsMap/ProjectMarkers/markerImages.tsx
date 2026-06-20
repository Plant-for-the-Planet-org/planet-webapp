import type { MapProjectProperties } from '../../../common/types/projectv2';
import type { Map as MaplibreMap } from 'maplibre-gl';

import { renderToStaticMarkup } from 'react-dom/server';
import {
  Agroforestry,
  Conservation,
  ManagedRegeneration,
  Mangroves,
  NaturalRegeneration,
  OtherPlanting,
  TreePlanting,
  UrbanRestoration,
} from '../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import { getProjectCategory } from '../../../../utils/projectV2';
import themeProperties from '../../../../theme/themeProperties';

/**
 * Rasterizes the per-category project pin SVGs into maplibre images so the
 * project markers can be drawn by a single GPU symbol layer (icon-image) instead
 * of ~259 HTML <Marker> DOM nodes. Keeps the existing custom pins + tier colors.
 */

const { colors } = themeProperties.designSystem;

type Tier = 'topProject' | 'regularProject' | 'nonDonatableProject';

const TIER_COLOR: Record<Tier, string> = {
  topProject: colors.goldenYellow,
  regularProject: colors.leafGreen,
  nonDonatableProject: colors.mediumGrey,
};

// Same shape selection ProjectMarkerIcon uses (purpose=conservation, else classification).
const SHAPE_COMPONENTS = {
  conservation: Conservation,
  'natural-regeneration': NaturalRegeneration,
  mangroves: Mangroves,
  'managed-regeneration': ManagedRegeneration,
  agroforestry: Agroforestry,
  'urban-planting': UrbanRestoration,
  'large-scale-planting': TreePlanting,
  'other-planting': OtherPlanting,
} as const;

type ShapeId = keyof typeof SHAPE_COMPONENTS;

const shapeIdFor = (p: MapProjectProperties): ShapeId | null => {
  if (p.purpose === 'conservation') return 'conservation';
  const classification = (p as { classification?: string }).classification;
  if (classification && classification in SHAPE_COMPONENTS) {
    return classification as ShapeId;
  }
  return null;
};

/**
 * Data-driven `icon-image` key for a project. Returns '' when there is no icon
 * for the project's classification (matches the old behaviour of rendering no pin).
 */
export const getMarkerIconKey = (p: MapProjectProperties): string => {
  const shape = shapeIdFor(p);
  if (!shape) return '';
  return `pin-${shape}-${getProjectCategory(p)}`;
};

// The old HTML marker was 30px wide (ProjectMarkers.module.scss .marker); the
// pin viewBox is ~43x49, so height ~= 34px. Rasterize at 2x for retina crispness.
const WIDTH = 30;
const HEIGHT = 34;
const RATIO = 2;

const svgToImage = (svg: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const sized = svg.replace(
      /^<svg/,
      `<svg width="${WIDTH * RATIO}" height="${HEIGHT * RATIO}"`
    );
    const img = new Image(WIDTH * RATIO, HEIGHT * RATIO);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  });

/**
 * Registers every (shape x tier) pin as a maplibre image. Idempotent and safe to
 * call repeatedly (e.g. on load and on styleimagemissing). Resolves once all
 * images are added.
 */
export const registerMarkerIcons = async (map: MaplibreMap): Promise<void> => {
  const tasks: Promise<void>[] = [];
  (Object.keys(SHAPE_COMPONENTS) as ShapeId[]).forEach((shape) => {
    (Object.keys(TIER_COLOR) as Tier[]).forEach((tier) => {
      const key = `pin-${shape}-${tier}`;
      if (map.hasImage(key)) return;
      const Shape = SHAPE_COMPONENTS[shape];
      const svg = renderToStaticMarkup(<Shape color={TIER_COLOR[tier]} />);
      tasks.push(
        svgToImage(svg)
          .then((img) => {
            if (!map.hasImage(key)) map.addImage(key, img, { pixelRatio: RATIO });
          })
          .catch(() => {
            /* a single icon failing to rasterize must not break the map */
          })
      );
    });
  });
  await Promise.all(tasks);
};
