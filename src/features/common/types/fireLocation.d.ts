import type { Feature, FeatureCollection, Point } from 'geojson';

export interface FireFeature extends Feature {
  geometry: Point;
  properties: {
    id: string;
    eventDate: string;
    type: 'fire';
    detectedBy: string;
    confidence: 'low' | 'medium' | 'high';
    distance: number;
  };
}

export interface FireFeatureCollection extends FeatureCollection {
  features: FireFeature[];
}
