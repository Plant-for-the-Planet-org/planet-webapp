import type {
  CategoryLegendData,
  LegendData,
  RangeLegendData,
  SimpleLegendData,
} from '../../../../../utils/mapsV2/mapSettings.config';

import { useTranslations } from 'next-intl';
import styles from '../MapFeatureExplorer.module.scss';

interface SimpleLegendProps {
  legend: SimpleLegendData;
}

interface RangeLegendProps {
  legend: RangeLegendData;
}

interface CategoryLegendProps {
  legend: CategoryLegendData;
}

interface LayerLegendProps {
  legend: LegendData;
}

const SimpleLegend = ({ legend }: SimpleLegendProps) => {
  return (
    <div className={styles.layerLegend}>
      <div
        className={`${styles.legendBar} ${styles.legendBarSimple}`}
        style={{ backgroundColor: legend.color }}
      ></div>
    </div>
  );
};

const RangeLegend = ({ legend }: RangeLegendProps) => {
  return (
    <div className={styles.layerLegend}>
      <div
        className={styles.legendBar}
        style={{ background: legend.gradient }}
      ></div>
      <div className={styles.legendValues}>
        <div>{legend.min}</div>
        <div>
          {legend.max}
          {legend.unit ? ` ${legend.unit}` : ''}
        </div>
      </div>
    </div>
  );
};

const CategoryLegend = ({ legend }: CategoryLegendProps) => {
  const tLegends = useTranslations('Maps.exploreLayers.legends');

  const firstCategory = legend.categories[0].categoryKey;
  const lastCategory =
    legend.categories[legend.categories.length - 1].categoryKey;

  return (
    <div className={styles.layerLegend}>
      <div className={`${styles.legendBar} ${styles.legendBarCategory}`}>
        {legend.categories.map((category) => {
          return (
            <div
              key={category.categoryKey}
              className={styles.legendCategoryColor}
              style={{ background: category.color }}
            ></div>
          );
        })}
      </div>
      <div className={styles.legendValues}>
        <div>{tLegends(firstCategory)}</div>
        <div>{tLegends(lastCategory)}</div>
      </div>
    </div>
  );
};

const LayerLegend = ({ legend }: LayerLegendProps) => {
  switch (legend.type) {
    case 'simple':
      return <SimpleLegend legend={legend} />;
    case 'category':
      return <CategoryLegend legend={legend} />;
    case 'range':
      return <RangeLegend legend={legend} />;
    default:
      return null;
  }
};

export default LayerLegend;
