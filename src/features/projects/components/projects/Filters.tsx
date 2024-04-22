import React, { ReactElement } from 'react';
import styles from '../../styles/Filters.module.scss';
import { useTranslations } from 'next-intl';
import { FormControlLabel, FormGroup } from '@mui/material';
import Switch from '../../../common/InputTypes/ToggleSwitch';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import { TreeProjectClassification } from '@planet-sdk/common/build/types/project/common';
import { useTenant } from '../../../common/Layout/TenantContext';

export default function Filters(): ReactElement {
  const t = useTranslations('Donate');
  const { tenantConfig } = useTenant();

  const { projects, setFilteredProjects, filtersOpen, setFilterOpen } =
    useProjectProps();

  const [type, setType] = React.useState<Record<string, boolean>>({
    'natural-regeneration': true,
    'managed-regeneration': true,
    'large-scale-planting': true,
    agroforestry: true,
    'urban-planting': true,
    'other-planting': true,
    mangroves: true,
  });

  const [filters, setFilters] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    function filterProjects() {
      const filteredProjects = projects
        ? projects.filter((project) => {
            const classification =
              project.properties.purpose === 'trees'
                ? project.properties.classification
                : null;
            if (classification && type[classification]) {
              return true;
            } else {
              return false;
            }
          })
        : [];
      setFilteredProjects(filteredProjects);
    }
    if (projects) {
      if (tenantConfig?.config.slug === 'salesforce') {
        filterProjects();
      } else {
        setFilteredProjects(projects);
      }
    }
  }, [projects, type]);

  React.useEffect(() => {
    function getFilters() {
      const filters =
        projects !== null
          ? (projects
              .map((project) => project.properties)
              .map((projectProperties) => {
                const classification =
                  projectProperties.purpose === 'trees'
                    ? projectProperties.classification
                    : null;
                return classification;
              })
              .filter(
                (classification) => classification !== null
              ) as TreeProjectClassification[])
          : [];
      const uniqueFilters = [...new Set(filters)];
      return uniqueFilters;
    }
    if (projects && tenantConfig?.config.slug === 'salesforce') {
      const filters = getFilters().filter((filter) => filter);
      setFilters(filters);
    }
  }, [projects]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType({ ...type, [event.target.name]: event.target.checked });
  };

  return tenantConfig?.config.slug === 'salesforce' ? (
    <div className={styles.filtersContainer}>
      <div className={styles.filterButtonContainer}>
        <div
          onClick={() => setFilterOpen(!filtersOpen)}
          className={`${styles.filterButton} ${
            filtersOpen ? styles.selected : ''
          }`}
        >
          <div className={styles.filterButtonText}>{t('filters')}</div>
          <div
            className={`${styles.dropdownIcon} ${
              filtersOpen ? styles.selected : ''
            }`}
          ></div>
        </div>
        {filtersOpen && (
          <div className={styles.dropdownContainer}>
            {/* <div className={styles.filterTitle}>{t('donate:projectPurpose')}</div>
          <FormGroup style={{ width: '100%' }}>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={purpose.restoration}
                    onChange={handlePurposeChange}
                    name="restoration"
                  />
                }
                label={t('donate:restoration')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={purpose.conservation}
                    onChange={handlePurposeChange}
                    name="conservation"
                  />
                }
                label={t('donate:conservation')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
          </FormGroup> */}
            <div className={styles.filterTitle}>{t('projectType')}</div>
            <FormGroup style={{ width: '100%' }}>
              {filters &&
                filters.map((filter, index: number) => {
                  return (
                    <div key={index} className={styles.filterToggleRow}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={type[filter]}
                            onChange={handleTypeChange}
                            name={filter}
                          />
                        }
                        label={t(filter)}
                      />
                      {/* <div className={styles.filterInfo}>
                <InfoIcon />
              </div> */}
                    </div>
                  );
                })}
            </FormGroup>
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
