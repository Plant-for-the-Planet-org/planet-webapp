import React, { ReactElement } from 'react';
import LandingSection from '../src/features/common/Layout/LandingSection';
import dynamic from 'next/dynamic';

interface Props {}

export default function Register({}: Props): ReactElement {
  const RegisterTrees = dynamic(
    () => import('../src/features/user/Profile/components/RegisterTrees')
  );
  return (
    <LandingSection
      fixedBg={true}
      imageSrc={
        process.env.CDN_URL
          ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
          : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
      }
    >
      <RegisterTrees />
    </LandingSection>
  );
}
