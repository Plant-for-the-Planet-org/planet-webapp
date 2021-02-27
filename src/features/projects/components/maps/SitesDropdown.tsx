import { createStyles, FormControl, InputBase, NativeSelect, Theme, withStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import PolygonIcon from '../../../../../public/assets/images/icons/PolygonIcon';
import styles from '../../styles/ProjectsMap.module.scss';

interface Props {
    geoJson: Object | null;
    selectedSite: number;
    setSelectedSite: Function;
}

export default function SitesDropdown({ geoJson, selectedSite, setSelectedSite }: Props): ReactElement {

    const handleChangeSite = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSite(event.target.value as string);
    };
    const BootstrapInput = withStyles((theme: Theme) =>
        createStyles({
            root: {
                'label + &': {
                    marginTop: theme.spacing(3),
                },
            },
            input: {
                borderRadius: 9,
                position: 'relative',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 3px 6px #00000029',
                fontSize: 16,
                padding: '8px 26px 8px 12px',
                transition: theme.transitions.create(['border-color', 'box-shadow']),
                // Use the system font instead of the default Roboto font.
                fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ].join(','),
                '&:focus': {
                    borderRadius: 4,
                    borderColor: '#80bdff',
                    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
                },
            },
        })
    )(InputBase);

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
