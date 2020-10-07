import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfleLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import Footer from '../../src/features/common/Footer';
import Layout from '../../src/features/common/Layout';
import PublicUserPage from '../../src/features/public/PublicUserProfile';
import UserNotFound from '../../src/features/common/ErrorComponents/UserProfile/UserNotFound';
import tenantConfig from '../../tenant.config';
import getsessionId from '../../src/utils/getSessionId';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';

const config = tenantConfig();

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
      const res = await fetch(
        `${process.env.API_ENDPOINT}/public/v1.0/en/treecounter/${slug}`,
        {
          headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId()  },
        }
      );
      if (res.ok === false) {
        setPublicUserprofile(null);
      } else {
        const newPublicUserprofile = await res.json();
        setPublicUserprofile(newPublicUserprofile);
      }
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
