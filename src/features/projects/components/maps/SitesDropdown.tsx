import { createStyles, FormControl, InputBase, NativeSelect, Theme, withStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import PolygonIcon from '../../../../../public/assets/images/icons/PolygonIcon';
import styles from '../../styles/ProjectsMap.module.scss';
import BootstrapInput from './BootstrapInput';

interface Props {
    geoJson: Object | null;
    selectedSite: number;
    setSelectedSite: Function;
}

export default function SitesDropdown({ geoJson, selectedSite, setSelectedSite }: Props): ReactElement {

    const handleChangeSite = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSite(event.target.value as string);
    };

    return (
        <>
            {/* <div className={styles.projectSitesButton}>
                <PolygonIcon />
            </div> */}
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
                                    <option value={index}>{site.properties.name}</option>
                                )
                            })}

                        </NativeSelect>
                    </FormControl>
                </div>
            </div>

        </>
    )
}
