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
  if (
    classification &&
    Object.prototype.hasOwnProperty.call(SHAPE_COMPONENTS, classification)
  ) {
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

// Transparent padding (display px) around the pin so the baked drop-shadow is
// not clipped. The bottom pad doubles as the anchor offset (see MARKER_ICON_OFFSET_Y).
const PAD = 8;

// The pin tip sits PAD px above the padded image's bottom edge; with
// icon-anchor 'bottom' the layer must offset the icon down by PAD so the tip
// lands on the project coordinate (the shadow then falls below it).
export const MARKER_ICON_OFFSET_Y = PAD;

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

// Composite the pin onto a padded canvas with the original drop-shadow baked in
// (matches the old `drop-shadow(0 4px 4px rgba(0,0,0,0.25))`).
const withShadow = (img: HTMLImageElement): ImageData | HTMLImageElement => {
  const w = (WIDTH + PAD * 2) * RATIO;
  const h = (HEIGHT + PAD * 2) * RATIO;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 4 * RATIO;
  ctx.shadowOffsetY = 4 * RATIO;
  ctx.drawImage(img, PAD * RATIO, PAD * RATIO, WIDTH * RATIO, HEIGHT * RATIO);
  return ctx.getImageData(0, 0, w, h);
};

const rasterizeAllIcons = async (map: MaplibreMap): Promise<void> => {
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
            if (!map.hasImage(key)) {
              map.addImage(key, withShadow(img), { pixelRatio: RATIO });
            }
          })
          .catch(() => {
            /* a single icon failing to rasterize must not break the map */
          })
      );
    });
  });
  await Promise.all(tasks);
};

// Coalesce the concurrent calls that fire during initial load: the symbol layer
// emits one `styleimagemissing` per missing icon (~24 at once), and rasterization
// is async, so without this each call would re-rasterize the whole set. Callers
// for the same map share one in-flight registration.
const inFlightRegistrations = new WeakMap<MaplibreMap, Promise<void>>();

/**
 * Registers every (shape x tier) pin as a maplibre image. Idempotent and safe to
 * call repeatedly (e.g. on load and on styleimagemissing).
 */
export const registerMarkerIcons = (map: MaplibreMap): Promise<void> => {
  const existing = inFlightRegistrations.get(map);
  if (existing) return existing;
  const registration = rasterizeAllIcons(map).finally(() => {
    inFlightRegistrations.delete(map);
  });
  inFlightRegistrations.set(map, registration);
  return registration;
};
