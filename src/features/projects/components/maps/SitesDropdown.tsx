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
  const [isPolygonMenuOpen, setIsPolygonMenuOpen] = React.useState(
    isMobile ? false : true
  );
  React.useEffect(() => {
    if (geoJson.features.length === 1) setIsPolygonMenuOpen(false);
  }, []);
  const handleChangeSite = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSite(event.target.value as string);
    if (isMobile) setIsPolygonMenuOpen(false);
  };

  return (
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
              {/* <InputLabel htmlFor="demo-customized-select-native">Image 1</InputLabel> */}
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
  );
}
