import { FormControl, NativeSelect } from '@material-ui/core';
import React, { ReactElement } from 'react';
import BootstrapInput from './BootstrapInput';
import styles from '../../styles/VegetationChange.module.scss';
import sources from '../../../../../public/data/maps/sources.json';

interface Props {
    selectedYear1: string;
    selectedYear2: string;
    setSelectedYear1: Function;
    setSelectedYear2: Function;
    rasterData: Object | null;
    selectedSource1: string;
    setSelectedSource1: Function;
    selectedSource2: string;
    setSelectedSource2: Function;
}

export default function ImageDropdown({
    selectedYear1, selectedYear2, setSelectedYear1, setSelectedYear2, rasterData, selectedSource1, setSelectedSource1, selectedSource2, setSelectedSource2
}: Props): ReactElement {

    console.log();
    const handleChangeYear1 = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedYear1(event.target.value as string);
    };
    const handleChangeYear2 = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedYear2(event.target.value as string);
    };
    const handleChangeSource1 = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSource1(event.target.value as string);
    };
    const handleChangeSource2 = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSource2(event.target.value as string);
    };

    return (
        <>
            <div className={styles.dropdownContainer}>
                <div className={styles.beforeYear}>
                    <FormControl>
                        <NativeSelect
                            id="customized-select-native"
                            value={selectedYear1}
                            onChange={handleChangeYear1}
                            input={<BootstrapInput />}
                        >
                            {rasterData.imagery[selectedSource1].map((item: any) => {
                                return (
                                    <option value={item.year}>{item.year}</option>
                                )
                            })}
                        </NativeSelect>
                    </FormControl>
                    <FormControl>
                        <NativeSelect
                            id="customized-select-native"
                            value={selectedSource1}
                            onChange={handleChangeSource1}
                            input={<BootstrapInput />}
                        >
                            {Object.keys(rasterData.imagery).map((item: any) => {
                                return (
                                    <option value={item}>{sources[item]}</option>
                                )
                            })}
                        </NativeSelect>
                    </FormControl>
                </div>
                <div className={styles.afterYear}>
                    <FormControl>
                        <NativeSelect
                            id="customized-select-native"
                            value={selectedSource2}
                            onChange={handleChangeSource2}
                            input={<BootstrapInput />}
                        >
                            {Object.keys(rasterData.imagery).map((item: any) => {
                                return (
                                    <option value={item}>{sources[item]}</option>
                                )
                            })}
                        </NativeSelect>
                    </FormControl>
                    <FormControl>
                        <NativeSelect
                            id="customized-select-native"
                            value={selectedYear2}
                            onChange={handleChangeYear2}
                            input={<BootstrapInput />}
                        >
                            {rasterData.imagery[selectedSource2].map((item: any) => {
                                return (
                                    <option value={item.year}>{item.year}</option>
                                )
                            })}
                        </NativeSelect>
                    </FormControl>

                </div>
            </div>
        </>
    )
}
