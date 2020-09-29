import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfleLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import Footer from '../../src/features/common/Footer';
import Layout from '../../src/features/common/Layout';
import PublicUserPage from '../../src/features/public/PublicUserProfile';
import UserNotFound from '../../src/features/common/ErrorComponents/UserProfile/UserNotFound';
import Head from 'next/head';
import tenantConfig from '../../tenant.config';
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
          headers: { 'tenant-key': `${process.env.TENANTID}` },
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
      <Head>
        <title>{`${
          publicUserprofile !== undefined
            ? publicUserprofile.displayName
            : config.meta.title
        }`}</title>
        <meta
          property="og:site_name"
          content={
            publicUserprofile !== undefined
              ? publicUserprofile.displayName
              : config.meta.title
          }
        />
        <meta
          property="og:url"
          content={`${process.env.SCHEME}://${config.tenantURL}`}
        />
        <meta
          property="og:title"
          content={`${
            publicUserprofile !== undefined
              ? publicUserprofile.displayName
              : config.meta.title
          }`}
        />
        <meta property="og:description" content={config.meta.description} />
        <meta name="description" content={config.meta.description} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content={config.meta.image} />
        {config.tenantName === 'planet' ? (
          <link rel="alternate" href="android-app://org.pftp/projects" />
        ) : null}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={config.meta.title} />
        <meta name="twitter:site" content={config.meta.twitterHandle} />
        <meta name="twitter:url" content={config.tenantURL} />
        <meta name="twitter:description" content={config.meta.description} />
      </Head>
      {initialized && publicUserprofile ? (
        <Layout>
          <PublicUserPage {...PublicUserProps} />
          <Footer />
        </Layout>
      ) : (
        <UserProfleLoader />
      )}
    </>
  );
}
