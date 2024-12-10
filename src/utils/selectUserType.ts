import type { UserType } from '@planet-sdk/common';

/**
 * Returns translated value of `type`
 * Default value = `tpo`
 */

export const selectUserType = (type: UserType, t: Function) => {
  let name;
  switch (type) {
    case 'individual':
      name = t('individual');
      break;
    case 'tpo':
      name = t('tpo');
      break;
    case 'education':
      name = t('education');
      break;
    case 'organization':
      name = t('organization');
      break;
    default:
      name = t('tpo');
      break;
  }
  return name;
};
