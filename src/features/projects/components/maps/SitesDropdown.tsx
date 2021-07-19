import {
  createStyles,
  FormControl,
  InputBase,
  NativeSelect,
  Theme,
  withStyles,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import PolygonIcon from '../../../../../public/assets/images/icons/PolygonIcon';
import styles from '../../styles/ProjectsMap.module.scss';
import BootstrapInput from '../../../common/InputTypes/BootstrapInput';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';

interface Props {}

export default function SitesDropdown(): ReactElement {
  const { geoJson, selectedSite, setSelectedSite, isMobile } = React.useContext(
    ProjectPropsContext
  );
  const [isPolygonMenuOpen, setIsPolygonMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) setIsPolygonMenuOpen(false);
  }, [isMobile]);

  const handleChangeSite = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSite(event.target.value as string);
    if (isMobile) setIsPolygonMenuOpen(false);
  };

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
              className={styles.projectSitesButton}
            >
              <PolygonIcon />
            </div>
          ) : null}
          {isPolygonMenuOpen ? (
            <div className={styles.dropdownContainer}>
              <div className={styles.projectSitesDropdown}>
                <FormControl>
                  <div className={styles.polygonIcon}>
                    <PolygonIcon />
                  </div>
                  <NativeSelect
                    id="customized-select-native"
                    value={selectedSite}
                    onChange={handleChangeSite}
                    input={<BootstrapInput />}
                  >
                    {geoJson.features.map((site: any, index: any) => {
                      return (
                        <option key={index} value={index}>
                          {site.properties.name}
                        </option>
                      );
                    })}
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
