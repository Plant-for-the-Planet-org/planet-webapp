export const selectUserType = (type: any, t: Function) => {
    let name;
    switch (type) {
      case 'individual':
        name = t('editProfile:individual');
        break;
      case 'tpo':
        name = t('editProfile:tpo');
        break;
      case 'education':
        name = t('editProfile:education');
        break;
      case 'organization':
        name = t('editProfile:organization');
        break;
      default:
        name = t('editProfile:tpo');
        break;
    }
    return name;
  };