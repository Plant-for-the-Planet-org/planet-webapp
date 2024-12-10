import type { ReactElement } from 'react';
import type {
  Imagery,
  RasterData,
} from '../../../common/types/ProjectPropsContextInterface';
import type { SetState } from '../../../common/types/common';

import { FormControl, NativeSelect } from '@mui/material';
import React from 'react';
import BootstrapInput from '../../../common/InputTypes/BootstrapInput';
import styles from '../../styles/VegetationChange.module.scss';
import sources from '../../../../../public/data/maps/sources.json';
import SourceIcon from '../../../../../public/assets/images/icons/SourceIcon';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';

interface Props {
  selectedYear1: string;
  selectedYear2: string;
  setSelectedYear1: SetState<string>;
  setSelectedYear2: SetState<string>;
  rasterData: RasterData;
  selectedSource1: keyof Imagery;
  setSelectedSource1: SetState<keyof Imagery>;
  selectedSource2: keyof Imagery;
  setSelectedSource2: SetState<keyof Imagery>;
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
  const { embed, showProjectDetails } = React.useContext(ParamsContext);

  const [isSource1MenuOpen, setIsSource1MenuOpen] = React.useState(
    isMobile ? false : true
  );
  const [isSource2MenuOpen, setIsSource2MenuOpen] = React.useState(
    isMobile ? false : true
  );

  const handleChangeYear1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear1(event.target.value);
  };
  const handleChangeYear2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear2(event.target.value);
  };
  const handleChangeSource1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSource1(event.target.value as keyof Imagery);
    if (isMobile) setIsSource1MenuOpen(false);
  };
  const handleChangeSource2 = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedSource2(event.target.value as keyof Imagery);
    if (isMobile) setIsSource2MenuOpen(false);
  };

  const containerClasses =
    embed !== 'true'
      ? styles.dropdownContainer
      : showProjectDetails === 'false'
      ? `${styles.embed_dropdownContainer} ${styles['no-project-details']}`
      : styles.embed_dropdownContainer;

  return (
    <>
      <div className={containerClasses}>
        <div className={styles.beforeYear}>
          <FormControl variant="standard">
            <NativeSelect
              id="customized-select-native-1"
              value={selectedYear1}
              onChange={handleChangeYear1}
              input={<BootstrapInput />}
            >
              {rasterData.imagery[selectedSource1]?.map((item) => {
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
            <FormControl variant="standard">
              <NativeSelect
                id="customized-select-native-2"
                value={selectedSource1}
                onChange={handleChangeSource1}
                input={<BootstrapInput />}
              >
                {Object.keys(rasterData.imagery).map((item) => {
                  return (
                    <option key={item} value={item}>
                      {sources[item as keyof Imagery]}
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
            <FormControl variant="standard">
              <NativeSelect
                id="customized-select-native-3"
                value={selectedSource2}
                onChange={handleChangeSource2}
                input={<BootstrapInput />}
              >
                {Object.keys(rasterData.imagery).map((item) => {
                  return (
                    <option key={item} value={item}>
                      {sources[item as keyof Imagery]}
                    </option>
                  );
                })}
              </NativeSelect>
            </FormControl>
          )}
          <FormControl variant="standard">
            <NativeSelect
              id="customized-select-native-4"
              value={selectedYear2}
              onChange={handleChangeYear2}
              input={<BootstrapInput />}
            >
              {rasterData.imagery[selectedSource2]?.map((item) => {
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
