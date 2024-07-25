import { MapProjectProperties } from '../../common/types/projectv2';

export const getProjectType = (projectProperties: MapProjectProperties) => {
  return projectProperties.purpose === 'trees' &&
    projectProperties.isTopProject &&
    projectProperties.isApproved
    ? 'topProject'
    : projectProperties.allowDonations
    ? 'regularProject'
    : 'nonDonatableProject';
};
