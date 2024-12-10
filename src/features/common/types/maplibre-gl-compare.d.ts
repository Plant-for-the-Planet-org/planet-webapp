declare module '@maplibre/maplibre-gl-compare' {
  import type { Map } from 'maplibre-gl';

  interface CompareOptions {
    mousemove?: boolean;
    orientation?: 'vertical' | 'horizontal';
  }

  class Compare {
    constructor(
      leftMap: Map,
      rightMap: Map,
      container: string | HTMLElement,
      options?: CompareOptions
    );

    remove(): void;
    setSlider(x: number): void;
    getSlider(): number;
  }

  export default Compare;
}
