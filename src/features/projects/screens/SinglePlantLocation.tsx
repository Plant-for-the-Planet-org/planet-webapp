import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import Explore from '../components/maps/Explore';
import ProjectTabs from '../components/maps/ProjectTabs';
import SitesDropdown from '../components/maps/SitesDropdown';
import ProjectSnippet from '../components/ProjectSnippet';
import { useRouter } from 'next/router';
import styles from '../styles/PlantLocation.module.scss';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import * as turf from '@turf/turf';
import formatDate from '../../../utils/countryCurrency/getFormattedDate';
import dynamic from 'next/dynamic';
import BackButton from '../../../../public/assets/images/icons/BackButton';

const ImageSlider = dynamic(
  () => import('../components/PlantLocation/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

const TimeTravel = dynamic(() => import('../components/maps/TimeTravel'), {
  ssr: false,
});

const { useTranslation } = i18next;

interface Props {
  plantLocation: Object;
}

export default function SinglePlantLocation({
  plantLocation,
}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const {
    project,
    geoJson,
    rasterData,
    selectedMode,
    selectedLocation,
    hoveredPl,
    setSelectedLocation,
    setHoveredPl,
  } = React.useContext(ProjectPropsContext);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [scrollY, setScrollY] = React.useState(0);
  const [treeCount, setTreeCount] = React.useState(1);
  const [plantationArea, setPlantationArea] = React.useState(0);

  React.useEffect(() => {
    let count = 0;
    if (plantLocation && plantLocation.plantedSpecies) {
      for (const key in plantLocation.plantedSpecies) {
        if (
          Object.prototype.hasOwnProperty.call(
            plantLocation.plantedSpecies,
            key
          )
        ) {
          const element = plantLocation.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      setTreeCount(count);
    }
    if (plantLocation && plantLocation.type === 'multi') {
      const area = turf.area(plantLocation.geometry);
      setPlantationArea(area / 10000);
    }
  }, [plantLocation]);

  function getSpeciesName(id: string) {
    for (const key in plantLocation.metadata.app.species) {
      if (
        Object.prototype.hasOwnProperty.call(
          plantLocation.metadata.app.species,
          key
        )
      ) {
        const element = plantLocation.metadata.app.species[key];
        if (element.id === id) {
          return element.aliases;
        }
      }
    }
    return null;
  }

  return (
    <>
      <Explore />
      {geoJson && <SitesDropdown />}
      {Object.keys(rasterData.imagery).length !== 0 &&
        rasterData.imagery.constructor === Object && <ProjectTabs />}
      {geoJson && selectedMode === 'imagery' && <TimeTravel />}
      <div
        style={{ transform: `translate(0,${scrollY}px)` }}
        className={'container'}
        onTouchMove={(event) => {
          if (isMobile) {
            if (event.targetTouches[0].clientY < (screenHeight * 2) / 8) {
              setScrollY(event.targetTouches[0].clientY);
            } else {
              setScrollY((screenHeight * 2) / 8);
            }
          }
        }}
      >
        <div className={'projectContainer'}>
          <button
            id={'backButtonSingleP'}
            style={{
              cursor: 'pointer',
              width: 'fit-content',
              position: 'absolute',
              zIndex: 3333,
            }}
            onClick={() => {
              if (selectedLocation || hoveredPl) {
                setSelectedLocation(null);
                setHoveredPl(null);
              } else {
                router.replace(`/${project.slug}`);
              }
            }}
          >
            <BackButton />
          </button>
          <div className={'projectSnippetContainer'}>
            <ProjectSnippet
              key={project.id}
              project={project}
              editMode={false}
            />
          </div>
          {plantLocation && (
            <div className={'singleProjectDetails'}>
              <div className={styles.treeCount}>
                {plantLocation.type === 'multi' && (
                  <>
                    <span>
                      {localizedAbbreviatedNumber(
                        i18n.language,
                        Number(treeCount),
                        1
                      )}{' '}
                      Trees
                    </span>{' '}
                    (
                    {localizedAbbreviatedNumber(
                      i18n.language,
                      Number(plantationArea),
                      3
                    )}{' '}
                    ha)
                  </>
                )}
                {plantLocation.type === 'single' && <span>1 Tree </span>}
                {plantLocation.type === 'sample' && <span>Sample Tree </span>}
              </div>
              {plantLocation.coordinates && (
                <ImageSlider
                  images={plantLocation.coordinates}
                  show={plantLocation}
                  height={233}
                  imageSize="large"
                />
              )}
              <div className={styles.locDetails}>
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>Planting Date</div>
                  <div className={styles.detailValue}>
                    {formatDate(plantLocation.plantDate)}
                  </div>
                </div>
                {plantLocation.type === 'multi' && (
                  <div className={styles.singleDetail}>
                    <div className={styles.detailTitle}>Planting Density</div>
                    <div className={styles.detailValue}>
                      {localizedAbbreviatedNumber(
                        i18n.language,
                        Number(treeCount / plantationArea),
                        1
                      )}{' '}
                      trees per ha
                    </div>
                  </div>
                )}
                {plantLocation.type === 'multi' &&
                  plantLocation.plantedSpecies && (
                    <div className={styles.singleDetail}>
                      <div className={styles.detailTitle}>
                        Species Planted ({plantLocation.plantedSpecies.length})
                      </div>
                      {plantLocation.plantedSpecies.map(
                        (sp: any, index: number) => {
                          const speciesName = getSpeciesName(
                            sp.scientificSpecies
                          );
                          return (
                            <div key={index} className={styles.detailValue}>
                              {sp.treeCount} <span>{speciesName}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                {plantLocation.type === 'multi' && (
                  <div className={styles.singleDetail}>
                    <div className={styles.detailTitle}>
                      Trees Sampled (
                      {plantLocation?.samplePlantLocations?.length})
                    </div>
                    {plantLocation.samplePlantLocations &&
                      plantLocation.samplePlantLocations.map(
                        (spl: any, index: number) => {
                          const speciesName = getSpeciesName(
                            spl.scientificSpecies
                          );
                          return (
                            <div className={styles.detailValue}>
                              {index + 1}. <span>{speciesName}</span>
                              <br />#{spl?.tag} • {spl?.measurements?.height}m
                              high • {spl?.measurements?.width}cm wide
                            </div>
                          );
                        }
                      )}
                  </div>
                )}
                {/* <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>Recruits (per HA)</div>
                <div className={styles.detailValue}>710,421</div>
              </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
