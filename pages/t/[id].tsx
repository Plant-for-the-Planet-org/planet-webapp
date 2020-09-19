import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfleLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import Footer from '../../src/features/common/Footer';
import Layout from '../../src/features/common/Layout';
import MetaTags from '../../src/features/common/MetaTags';
import PublicUserPage from '../../src/features/public/PublicUserProfile';
import { getImageUrl } from '../../src/utils/getImageURL';
import UserNotFound from '../../src/features/common/ErrorComponents/UserProfile/UserNotFound';

export default function PublicUser() {
  const [publicUserprofile, setPublicUserprofile] = React.useState();
  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const [imageSource, SetImageSource] = React.useState('');

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
          headers: { 'tenant-key': `${process.env.TENANTID}` },
        },
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
  React.useEffect(() => {
    if (publicUserprofile !== undefined) {
      var newimageSource = publicUserprofile.userProfile.image
        ? getImageUrl('project', 'medium', publicUserprofile.userProfile.image)
        : '';
      SetImageSource(newimageSource);
    }
  }, [publicUserprofile]);

  if (publicUserprofile === null) {
    return (
      <UserNotFound />
    );
  }

  return publicUserprofile ? (
    <Layout>
      <MetaTags
        title={publicUserprofile.displayName}
        desc={
          publicUserprofile.description
            ? publicUserprofile.description
            : "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis."
        }
        imageURL={imageSource}
        ogType={'profile'}
      />
      <PublicUserPage {...PublicUserProps} />
      <Footer />
    </Layout>
  ) : <UserProfleLoader />;
}
