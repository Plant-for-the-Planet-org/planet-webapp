import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfleLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import Footer from '../../src/features/common/Layout/Footer';
import Layout from '../../src/features/common/Layout';
import PublicUserPage from '../../src/features/public/PublicUserProfile';
import UserNotFound from '../../src/features/common/ErrorComponents/UserProfile/UserNotFound';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import { getUserProfile } from '../../src/utils/apiRequests/userProfile/getUserProfile';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const [publicUserprofile, setPublicUserprofile] = React.useState();
  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const router = useRouter();
  const PublicUserProps = {
    publicUserprofile,
  };

  useEffect(() => {
    if (router && router.query.id !== undefined) {
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadPublicUserData() {
      const newPublicUserprofile = await getUserProfile(slug);
      if(newPublicUserprofile === '404'){
        router.push('/404', undefined, { shallow: true });
      }
      setPublicUserprofile(newPublicUserprofile)
    }
    if (ready) {
      loadPublicUserData();
    }
  }, [ready]);

  if (publicUserprofile === null) {
    return <UserNotFound />;
  }

  return (
    <>
      <GetPublicUserProfileMeta publicUserprofile={publicUserprofile} />
      <Layout>
        {initialized && publicUserprofile ? (
            <PublicUserPage {...PublicUserProps} />
          ) : (
            <UserProfleLoader />
        )}
        <Footer />
      </Layout>
    </>
  );
}
