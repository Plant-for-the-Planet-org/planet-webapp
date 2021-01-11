import React, { ReactElement } from 'react';
import LandingSection from '../src/features/common/Layout/LandingSection';
import RegisterTrees from '../src/features/user/UserProfile/components/RegisterTrees';
import { getLocalUserInfo } from '../src/utils/auth0/localStorageUtils';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {}

export default function Register({}: Props): ReactElement {
  const [currentUserSlug, setCurrentUserSlug] = React.useState();
  const [registerTreesModalOpen, setRegisterTreesModalOpen] = React.useState(
    true
  );

  const [token, setToken] = React.useState('')
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
      getLocalUserInfo() && getLocalUserInfo().slug
        ? setCurrentUserSlug(getLocalUserInfo().slug)
        : null;
    }
    if (isAuthenticated && !isLoading) {
      loadFunction()
    }
  }, [isAuthenticated, isLoading])

  return (
    <LandingSection
      fixedBg={true}
      imageSrc={
        process.env.CDN_URL
          ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
          : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
      }
    >
      {!isLoading && currentUserSlug ? (
        <RegisterTrees
          registerTreesModalOpen={registerTreesModalOpen}
          slug={currentUserSlug}
          token={token}
        />
      ) : null}
    </LandingSection>
  );
}
