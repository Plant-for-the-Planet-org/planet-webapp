import React, { ReactElement } from 'react';
import RegisterTrees from '../../src/features/user/UserProfile/components/RegisterTrees';
import { useAuth0 } from '@auth0/auth0-react';
import AccountHeader from '../../src/features/common/Layout/Header/accountHeader';
import i18next from '../../i18n';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import AccountFooter from '../../src/features/common/Layout/Footer/accountFooter';
import NewAccountHeader from '../../src/features/common/Layout/Header/newAccountHeader';
interface Props {}
const { useTranslation } = i18next;
export default function Register({}: Props): ReactElement {
  const [currentUserSlug, setCurrentUserSlug] = React.useState();
  const [registerTreesModalOpen, setRegisterTreesModalOpen] = React.useState(
    true
  );

  const { userprofile } = React.useContext(UserPropsContext);

  const [token, setToken] = React.useState('');
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
      userprofile && userprofile.slug
        ? setCurrentUserSlug(userprofile.slug)
        : null;
    }
    if (isAuthenticated && !isLoading) {
      loadFunction();
    }
  }, [isAuthenticated, isLoading]);
  const { t } = useTranslation(['me']);
  return (
    <>
      <NewAccountHeader page={'register-trees'} title={t('me:registerTrees')} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!isLoading && currentUserSlug ? (
          <RegisterTrees
            registerTreesModalOpen={registerTreesModalOpen}
            slug={currentUserSlug}
            token={token}
          />
        ) : null}
      </div>
      <AccountFooter />
    </>
  );
}
