import type {
  PlantLocationDetailsApiResponse,
  PlantLocation,
  PlantLocationProperties,
} from '../../../../../../../common/types/dataExplorer';

import { useLocale, useTranslations } from 'next-intl';
import styles from './index.module.scss';
import PlantLocationDetailsZeroState from '../PlantLocationDetailsZeroState';
import { getFormattedNumber } from '../../../../../../../../utils/getFormattedNumber';
import TreeMapperIcon from '../../../../../../../../../public/assets/images/icons/projectV2/TreeMapperIcon';

interface Props {
  plantLocationDetails: PlantLocationDetailsApiResponse['res'] | null;
  selectedLayer: PlantLocation['properties'];
  loading: boolean;
}

type PlantationUnitInfoProp = Omit<Props, 'plantLocationDetails' | 'loading'>;
type ListOfSpeciesPlantedProp = {
  plantLocationDetails: PlantLocationDetailsApiResponse['res'];
};

const PlantationUnitInfo = ({ selectedLayer }: PlantationUnitInfoProp) => {
  const t = useTranslations('TreemapperAnalytics');
  const locale = useLocale();
  return (
    <div className={styles.topContainer}>
      {selectedLayer.treeCount && (
        <div className={styles.leftContainer}>
          <p className={styles.title}>{t('speciesPlanted')}</p>
          <p>
            {getFormattedNumber(locale, selectedLayer.treeCount)}&nbsp;
            {t('trees')}
          </p>
        </div>
      )}
      {selectedLayer?.density && (
        <div className={styles.rightContainer}>
          <div className={styles.title}>
            <p>{t('plantingDensity')}</p>
          </div>
          <p>
            {getFormattedNumber(
              locale,
              Number((selectedLayer?.density * 1000).toFixed(1))
            )}
            &nbsp;
            {t('treesPerHa')}
          </p>
        </div>
      )}
    </div>
  );
};

const ListOfSpeciesPlanted = ({
  plantLocationDetails,
}: ListOfSpeciesPlantedProp) => {
  const t = useTranslations('TreemapperAnalytics');
  const locale = useLocale();
  return plantLocationDetails?.plantedSpecies !== null ? (
    <div className={styles.midContainer}>
      <div className={styles.title}>
        {t('speciesPlanted')}&nbsp;(
        {plantLocationDetails?.plantedSpecies.length})
      </div>
      <div className={styles.speciesContainer}>
        {plantLocationDetails?.plantedSpecies.map((species) => {
          return (
            <div
              key={species.scientificName}
              className={styles.individualSpeciesContainer}
              title={species.scientificName}
            >
              <div className={styles.speciesName}>{species.scientificName}</div>
              <div className={styles.count}>
                {getFormattedNumber(locale, species.treeCount)}
              </div>
              {plantLocationDetails.totalPlantedTrees > 1 && (
                <div className={styles.totalPercentage}>
                  {(
                    (species.treeCount /
                      plantLocationDetails.totalPlantedTrees) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

const SampleTreesInfo = ({
  plantLocationDetails,
}: ListOfSpeciesPlantedProp) => {
  const t = useTranslations('TreemapperAnalytics');
  return plantLocationDetails?.samplePlantLocations ? (
    <>
      {' '}
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
                  <p className={styles.species}>
                    {samplePlantLocation.species}
                  </p>
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
    </>
  ) : (
    <></>
  );
};

const PlantLocationHeader = ({ type, hid }: PlantLocationProperties) => {
  const t = useTranslations('TreemapperAnalytics');
  const formattedHid = hid.substring(0, 3) + '-' + hid.substring(3);

  return (
    <header className={styles.header}>
      <div>{t(`plantLocationType.${type}`)}</div>
      <div className={styles.hid}>#{formattedHid}</div>
    </header>
  );
};

const PlantLocationDetails = ({
  plantLocationDetails,
  selectedLayer,
  loading,
}: Props) => {
  const plantLocationType = plantLocationDetails?.properties.type;

  const hasData =
    plantLocationDetails !== null &&
    Boolean(
      (plantLocationType === 'multi-tree-registration' &&
        (selectedLayer.treeCount || selectedLayer.density)) ||
        (plantLocationDetails?.plantedSpecies?.length || 0) > 0 ||
        (plantLocationDetails?.samplePlantLocations?.length || 0) > 0
    );

  return (
    <div className={styles.plantLocationDetailsContainer}>
      <div className={styles.content}>
        {loading ? (
          <>
            <div></div>
            <div className={styles.spinner}></div>
          </>
        ) : hasData ? (
          <div className={styles.contentTop}>
            <PlantLocationHeader
              type={plantLocationDetails.properties.type}
              hid={plantLocationDetails.properties.hid}
            />
            {plantLocationType === 'multi-tree-registration' && (
              <PlantationUnitInfo selectedLayer={selectedLayer} />
            )}
            <ListOfSpeciesPlanted plantLocationDetails={plantLocationDetails} />
            {plantLocationType === 'multi-tree-registration' &&
              plantLocationDetails.totalSamplePlantLocations !== null && (
                <SampleTreesInfo plantLocationDetails={plantLocationDetails} />
              )}
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
          <a
            href="https://treemapper.app"
            rel="noopener noreferrer"
            target="_blank"
            className={styles.treemapper}
          >
            TreeMapper
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlantLocationDetails;
