import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import {
  PlantLocationDetailsApiResponse,
  PlantLocation,
} from '../../../../../../../common/types/dataExplorer';
import PlantLocationDetailsZeroState from '../PlantLocationDetailsZeroState';
import TreeMapperIcon from '../TreeMapperIcon';

interface Props {
  plantLocationDetails: PlantLocationDetailsApiResponse['res'] | null;
  selectedLayer: PlantLocation['properties'];
}

const PlantLocationDetails = ({
  plantLocationDetails,
  selectedLayer,
}: Props) => {
  const { t } = useTranslation(['treemapperAnalytics']);

  return (
    <div className={styles.plantLocationDetailsContainer}>
      <div className={styles.content}>
        {plantLocationDetails ? (
          <div className={styles.contentTop}>
            <div className={styles.topContainer}>
              <div className={styles.leftContainer}>
                <p className={styles.title}>{t('speciesPlanted')}</p>
                <p>
                  {selectedLayer.treeCount}&nbsp;{t('trees')}
                </p>
              </div>
              <div className={styles.rightContainer}>
                <div className={styles.title}>
                  <p>{t('plantingDensity')}</p>
                </div>
                <p>
                  {selectedLayer?.density?.toFixed(4)}&nbsp;
                  {t('treesPerHa')}
                </p>
              </div>
            </div>
            <div className={styles.midContainer}>
              <div className={styles.title}>
                {t('speciesPlanted')}&nbsp;(
                {plantLocationDetails.plantedSpecies.length})
              </div>
              <div className={styles.speciesContainer}>
                {plantLocationDetails &&
                  plantLocationDetails.plantedSpecies.map((species) => {
                    return (
                      <div
                        key={species.scientificName}
                        className={styles.individualSpeciesContainer}
                      >
                        <div className={styles.speciesName}>
                          {species.scientificName}
                        </div>
                        <div className={styles.count}>{species.treeCount}</div>
                        <div className={styles.totalPercentage}>
                          {(
                            (species.treeCount /
                              plantLocationDetails.totalPlantedTrees) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.title}>
                {t('sampleTrees')}&nbsp;(
                {plantLocationDetails?.totalSamplePlantLocations})
              </div>
              {plantLocationDetails?.samplePlantLocations?.map(
                (samplePlantLocation, index) => {
                  return (
                    <div
                      key={samplePlantLocation.guid}
                      className={styles.sampleTreeContainer}
                    >
                      <p className={styles.title}>
                        {index + 1}.&nbsp;
                        {samplePlantLocation.species}
                      </p>
                      <p>
                        {t('tag')} #{samplePlantLocation.tag} •{' '}
                        {samplePlantLocation.measurements.height}m high •{' '}
                        {samplePlantLocation.measurements.width}cm wide
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <>
            <div></div>
            <div className={styles.zeroStateScreen}>
              <PlantLocationDetailsZeroState />
            </div>
          </>
        )}
        <div className={styles.footer}>
          <p>Powered by </p>
          <span>
            <TreeMapperIcon />
          </span>
          <p className={styles.treemapper}>TreeMapper</p>
        </div>
      </div>
    </div>
  );
};

export default PlantLocationDetails;
