import { FormControl, NativeSelect } from '@mui/material';
import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import PolygonIcon from '../../../../../public/assets/images/icons/PolygonIcon';
import styles from '../../styles/ProjectsMap.module.scss';
import BootstrapInput from '../../../common/InputTypes/BootstrapInput';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { SingleProjectGeojson } from '../../../../features/common/types/project';
interface Props {}

export default function SitesDropdown(): ReactElement {
  const {
    setSelectedPl,
    geoJson,
    project,
    selectedSite,
    setSelectedSite,
    isMobile,
    isPolygonMenuOpen,
    setIsPolygonMenuOpen,
  } = React.useContext(ProjectPropsContext);
  const { embed } = React.useContext(ParamsContext);
  const router = useRouter();

  const handleChangeSite = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPl(null);
    setSelectedSite(event.target.value as number);
    router.push(
      `/${project.slug}/?site=${
        geoJson.features[event.target.value].properties.id
      }`
    );

    if (isMobile) setIsPolygonMenuOpen(false);
  };
  const dropdownContainerClasses = `${
    embed === 'true' ? styles.embed_dropdownContainer : styles.dropdownContainer
  } ${
    router.pathname === '/[p]'
      ? styles['dropdownContainer--reduce-right-offset']
      : ''
  }`;

  const projectSitesButtonClasses = `${
    embed === 'true'
      ? styles.embed_projectSitesButton
      : styles.projectSitesButton
  } ${
    router.pathname === '/[p]'
      ? styles['projectSitesButton--reduce-right-offset']
      : ''
  }`;

  return (
    <>
      {geoJson.features.length > 1 && (
        <>
          {!isPolygonMenuOpen ? (
            <div
              onMouseOver={() => {
                if (isMobile) setIsPolygonMenuOpen(true);
              }}
              onClick={() => {
                if (!isMobile) setIsPolygonMenuOpen(true);
              }}
              className={projectSitesButtonClasses}
            >
              <PolygonIcon />
            </div>
          ) : null}
          {isPolygonMenuOpen ? (
            <div className={dropdownContainerClasses}>
              <div className={styles.projectSitesDropdown}>
                <FormControl variant="standard">
                  <div className={styles.polygonIcon}>
                    <PolygonIcon />
                  </div>
                  <NativeSelect
                    id="customized-select-native"
                    value={selectedSite}
                    onChange={handleChangeSite}
                    input={<BootstrapInput />}
                  >
                    {geoJson?.features.map(
                      (site: SingleProjectGeojson, index: number) => {
                        return (
                          <option key={index} value={index}>
                            {site.properties.name}
                          </option>
                        );
                      }
                    )}
                  </NativeSelect>
                </FormControl>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
