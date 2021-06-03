import React, { ReactElement } from 'react';
import AccountHeader from '../../src/features/common/Layout/Header/AccountHeader';
import i18next from '../../i18n';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import AccountFooter from '../../src/features/common/Layout/Footer/accountFooter';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';

interface Props {}
const { useTranslation } = i18next;
export default function Register({}: Props): ReactElement {
  const { userprofile, isLoaded, token } = React.useContext(UserPropsContext);

  const { t } = useTranslation(['me']);
  return (
    <>
      {isLoaded && userprofile && token ? (
        <>
          <AccountHeader
            page={'manage-projects'}
            title={t('me:manageProjects')}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <ProjectsContainer /> */}
          </div>
          <AccountFooter />
        </>
      ) : (
        <UserProfileLoader />
      )}
    </>
  );
}
