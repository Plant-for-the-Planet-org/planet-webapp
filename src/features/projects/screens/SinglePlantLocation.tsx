import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
import BackButton from '../../../../out/assets/images/icons/BackButton';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import Explore from '../components/maps/Explore';
import ProjectTabs from '../components/maps/ProjectTabs';
import SitesDropdown from '../components/maps/SitesDropdown';
import TimeTravel from '../components/maps/TimeTravel';
import ProjectSnippet from '../components/ProjectSnippet';
import { useRouter } from 'next/router';
import ImageSlider from '../components/PlantLocation/ImageSlider';
import styles from '../styles/PlantLocation.module.scss';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import * as turf from '@turf/turf';
import formatDate from '../../../utils/countryCurrency/getFormattedDate';

const { useTranslation } = i18next;

interface Props {}

export default function SinglePlantLocation({}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const { project, selectedLocation } = React.useContext(ProjectPropsContext);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [scrollY, setScrollY] = React.useState(0);
  const [treeCount, setTreeCount] = React.useState(1);
  const [plantationArea, setPlantationArea] = React.useState(0);
  React.useEffect(() => {
    let count = 0;
    if (selectedLocation.plantedSpecies) {
      for (const key in selectedLocation.plantedSpecies) {
        if (
          Object.prototype.hasOwnProperty.call(
            selectedLocation.plantedSpecies,
            key
          )
        ) {
          const element = selectedLocation.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      setTreeCount(count);
    }
    if (selectedLocation.type === 'multi') {
      const area = turf.area(selectedLocation.geometry);
      setPlantationArea(area / 10000);
    }
  }, [selectedLocation]);

  return (
    <>
      <Explore />
      {/* {geoJson && <SitesDropdown />} */}
      {/* {Object.keys(rasterData.imagery).length !== 0 &&
        rasterData.imagery.constructor === Object && <ProjectTabs />} */}
      {/* {geoJson && selectedMode === 'imagery' && <TimeTravel />} */}
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
              router.back();
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
          <div className={'singleProject'}>
            <div className={styles.treeCount}>
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
                1
              )}{' '}
              ha)
            </div>
            <ImageSlider
              images={selectedLocation.coordinates}
              height={233}
              imageSize="medium"
            />
            <div className={styles.locDetails}>
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>Planting Date</div>
                <div className={styles.detailValue}>
                  {formatDate(selectedLocation.plantDate)}
                </div>
              </div>
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
              {selectedLocation.plantedSpecies && (
                <div className={styles.singleDetail}>
                  <div className={styles.detailTitle}>
                    Species Planted ({selectedLocation.plantedSpecies.length})
                  </div>
                  {selectedLocation.plantedSpecies.map((sp: any) => {
                    return (
                      <div className={styles.detailValue}>
                        {sp.treeCount} dummy name
                      </div>
                    );
                  })}
                </div>
              )}
              <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>Trees Sampled (12)</div>
                <div className={styles.detailValue}>
                  1. Cedrela odorada
                  <br />
                  #TAG-12344 • 0.5m high • 20 cm wide
                </div>
              </div>
              {/* <div className={styles.singleDetail}>
                <div className={styles.detailTitle}>Recruits (per HA)</div>
                <div className={styles.detailValue}>710,421</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
