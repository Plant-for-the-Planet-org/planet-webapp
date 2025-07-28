import type {
  InterventionDetailsApiResponse,
  InterventionFeature,
  InterventionProperties,
} from '../../../../../../../common/types/dataExplorer';

import { useLocale, useTranslations } from 'next-intl';
import styles from './index.module.scss';
import InterventionDetailsZeroState from '../InterventionDetailsZeroState';
import { getFormattedNumber } from '../../../../../../../../utils/getFormattedNumber';
import TreeMapperIcon from '../../../../../../../../../public/assets/images/icons/projectV2/TreeMapperIcon';

interface Props {
  interventionDetails: InterventionDetailsApiResponse['res'] | null;
  selectedLayer: InterventionFeature['properties'];
  loading: boolean;
}

type PlantationUnitInfoProp = Omit<Props, 'interventionDetails' | 'loading'>;
type ListOfSpeciesPlantedProp = {
  interventionDetails: InterventionDetailsApiResponse['res'];
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
  interventionDetails,
}: ListOfSpeciesPlantedProp) => {
  const t = useTranslations('TreemapperAnalytics');
  const locale = useLocale();
  return interventionDetails?.plantedSpecies !== null ? (
    <div className={styles.midContainer}>
      <div className={styles.title}>
        {t('speciesPlanted')}&nbsp;(
        {interventionDetails?.plantedSpecies.length})
      </div>
      <div className={styles.speciesContainer}>
        {interventionDetails?.plantedSpecies.map((species) => {
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
              {interventionDetails.totalPlantedTrees > 1 && (
                <div className={styles.totalPercentage}>
                  {(
                    (species.treeCount /
                      interventionDetails.totalPlantedTrees) *
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

const SampleTreesInfo = ({ interventionDetails }: ListOfSpeciesPlantedProp) => {
  const t = useTranslations('TreemapperAnalytics');
  return interventionDetails?.samplePlantLocations ? (
    <>
      {' '}
      <div className={styles.bottomContainer}>
        <div className={styles.title}>
          {t('sampleTrees')}&nbsp;(
          {interventionDetails?.totalSamplePlantLocations})
        </div>
        {interventionDetails?.samplePlantLocations?.map(
          (sampleIntervention, index) => {
            return (
              <div
                key={sampleIntervention.guid}
                className={styles.sampleTreeContainer}
              >
                <p className={styles.title}>
                  {index + 1}.&nbsp;
                  <p className={styles.species}>{sampleIntervention.species}</p>
                </p>

                <p>
                  {t('tag')} #{sampleIntervention.tag} •{' '}
                  {sampleIntervention.measurements.height}m high •{' '}
                  {sampleIntervention.measurements.width}cm wide
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

const InterventionHeader = ({ type, hid }: InterventionProperties) => {
  const t = useTranslations('TreemapperAnalytics');
  const formattedHid = hid.substring(0, 3) + '-' + hid.substring(3);

  return (
    <header className={styles.header}>
      <div>{t(`plantLocationType.${type}`)}</div>
      <div className={styles.hid}>#{formattedHid}</div>
    </header>
  );
};

const InterventionDetails = ({
  interventionDetails,
  selectedLayer,
  loading,
}: Props) => {
  const interventionType = interventionDetails?.properties.type;

  const hasData =
    interventionDetails !== null &&
    Boolean(
      (interventionType === 'multi-tree-registration' &&
        (selectedLayer.treeCount || selectedLayer.density)) ||
        (interventionDetails?.plantedSpecies?.length || 0) > 0 ||
        (interventionDetails?.samplePlantLocations?.length || 0) > 0
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
            <InterventionHeader
              type={interventionDetails.properties.type}
              hid={interventionDetails.properties.hid}
            />
            {interventionType === 'multi-tree-registration' && (
              <PlantationUnitInfo selectedLayer={selectedLayer} />
            )}
            <ListOfSpeciesPlanted interventionDetails={interventionDetails} />
            {interventionType === 'multi-tree-registration' &&
              interventionDetails.totalSamplePlantLocations !== null && (
                <SampleTreesInfo interventionDetails={interventionDetails} />
              )}
          </div>
        ) : (
          <>
            <div></div>
            <div className={styles.zeroStateScreen}>
              <InterventionDetailsZeroState />
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

export default InterventionDetails;
