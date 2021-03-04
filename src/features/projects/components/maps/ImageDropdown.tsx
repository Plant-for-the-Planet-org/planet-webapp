import { FormControl, NativeSelect } from '@material-ui/core';
import React, { ReactElement } from 'react';
import BootstrapInput from '../../../common/InputTypes/BootstrapInput';
import styles from '../../styles/VegetationChange.module.scss';
import sources from '../../../../../public/data/maps/sources.json';
import SourceIcon from '../../../../../public/assets/images/icons/SourceIcon';

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
  isMobile: boolean;
}

export default function ImageDropdown({
  selectedYear1,
  selectedYear2,
  setSelectedYear1,
  setSelectedYear2,
  rasterData,
  selectedSource1,
  setSelectedSource1,
  selectedSource2,
  setSelectedSource2,
  isMobile,
}: Props): ReactElement {
  const [isSource1MenuOpen, setIsSource1MenuOpen] = React.useState(
    isMobile ? false : true
  );
  const [isSource2MenuOpen, setIsSource2MenuOpen] = React.useState(
    isMobile ? false : true
  );

  console.log();
  const handleChangeYear1 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear1(event.target.value as string);
  };
  const handleChangeYear2 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear2(event.target.value as string);
  };
  const handleChangeSource1 = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedSource1(event.target.value as string);
    if (isMobile) setIsSource1MenuOpen(false);
  };
  const handleChangeSource2 = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedSource2(event.target.value as string);
    if (isMobile) setIsSource2MenuOpen(false);
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
                  <option key={item.year} value={item.year}>
                    {item.year}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
          {isMobile && !isSource1MenuOpen ? (
            <div
              onMouseOver={() => {
                setIsSource1MenuOpen(true);
              }}
            >
              <div className={styles.sourceIcon}>
                <SourceIcon />
              </div>
            </div>
          ) : null}
          {isSource1MenuOpen && (
            <FormControl>
              <NativeSelect
                id="customized-select-native"
                value={selectedSource1}
                onChange={handleChangeSource1}
                input={<BootstrapInput />}
              >
                {Object.keys(rasterData.imagery).map((item: any) => {
                  return (
                    <option key={item} value={item}>
                      {sources[item]}
                    </option>
                  );
                })}
              </NativeSelect>
            </FormControl>
          )}
        </div>
        <div className={styles.afterYear}>
          {isMobile && !isSource2MenuOpen ? (
            <div
              onMouseOver={() => {
                setIsSource2MenuOpen(true);
              }}
            >
              <div className={styles.sourceIcon}>
                <SourceIcon />
              </div>
            </div>
          ) : null}
          {isSource2MenuOpen && (
            <FormControl>
              <NativeSelect
                id="customized-select-native"
                value={selectedSource2}
                onChange={handleChangeSource2}
                input={<BootstrapInput />}
              >
                {Object.keys(rasterData.imagery).map((item: any) => {
                  return (
                    <option key={item} value={item}>
                      {sources[item]}
                    </option>
                  );
                })}
              </NativeSelect>
            </FormControl>
          )}
          <FormControl>
            <NativeSelect
              id="customized-select-native"
              value={selectedYear2}
              onChange={handleChangeYear2}
              input={<BootstrapInput />}
            >
              {rasterData.imagery[selectedSource2].map((item: any) => {
                return (
                  <option key={item.year} value={item.year}>
                    {item.year}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    </>
  );
}
