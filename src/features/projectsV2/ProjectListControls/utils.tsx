import { TreeProjectClassification } from '@planet-sdk/common';
import { MapProject } from '../../common/types/projectv2';

export const availableFilters: TreeProjectClassification[] = [
  'large-scale-planting',
  'agroforestry',
  'natural-regeneration',
  'managed-regeneration',
  'urban-planting',
  'other-planting',
];

/**
 * @param {MapProject[] | null} projects - The list of projects to search through.
 * @param {string} keyword - The search keyword used to filter projects. If the
 *        keyword is an empty string or contains only whitespace, an empty array is returned.
 * @returns {MapProject[]} A filtered list of projects that contain the keyword in
 *          either the project name, location (if applicable), TPO name, or country.
 */
export const getSearchProjects = (
  projects: MapProject[] | null,
  keyword: string
) => {
  if (!keyword?.trim()) {
    return [];
  }
  const normalizedKeyword = keyword
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const filteredProjects = projects?.filter((project: MapProject) => {
    const normalizedText = (text: string | undefined | null) => {
      return text
        ? text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        : '';
    };

    const projectName = normalizedText(project.properties.name);
    const projectLocation =
      project.properties.purpose === 'trees'
        ? normalizedText(project.properties.location)
        : '';
    const tpoName = normalizedText(project.properties.tpo.name);
    const country = normalizedText(project.properties.country.toLowerCase());

    return (
      projectName.includes(normalizedKeyword) ||
      projectLocation.includes(normalizedKeyword) ||
      tpoName.includes(normalizedKeyword) ||
      country.includes(normalizedKeyword)
    );
  });
  return filteredProjects;
};
