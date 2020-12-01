import { useSession } from 'next-auth/client';
import React, { ReactElement } from 'react';
import LandingSection from '../src/features/common/Layout/LandingSection';
import RegisterTrees from '../src/features/user/UserProfile/components/RegisterTrees';
import { getUserInfo } from '../src/utils/auth0/localStorageUtils';

interface Props {}

export default function Register({}: Props): ReactElement {
  const [session, loading] = useSession();
  const [currentUserSlug, setCurrentUserSlug] = React.useState();
  const [registerTreesModalOpen, setRegisterTreesModalOpen] = React.useState(
    true
  );

  React.useEffect(() => {
    getUserInfo() && getUserInfo().slug
      ? setCurrentUserSlug(getUserInfo().slug)
      : null;
  }, [loading]);
  return (
    <LandingSection
      fixedBg={true}
      imageSrc={
        process.env.CDN_URL
          ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
          : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
      }
    >
      {currentUserSlug ? (
        <RegisterTrees
          registerTreesModalOpen={registerTreesModalOpen}
          slug={currentUserSlug}
          session={session}
        />
      ) : null}
    </LandingSection>
  );
}
