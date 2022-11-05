import React, { ReactElement } from 'react';
import Footer from '../src/features/common/Layout/Footer';
import LandingSection from '../src/features/common/Layout/LandingSection';
import VerifyEmailComponent from './../src/features/common/VerifyEmail/VerifyEmail';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {}

function VerifyEmail({}: Props): ReactElement {
  return (
    <div>
      <LandingSection>
        <VerifyEmailComponent />
      </LandingSection>

      <Footer />
    </div>
  );
}

export default VerifyEmail;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donation',
          'editProfile',
          'leaderboard',
          'managePay',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTree',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
