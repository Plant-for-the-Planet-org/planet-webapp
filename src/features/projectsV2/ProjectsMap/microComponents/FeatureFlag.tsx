import type { ReactElement, ReactNode } from 'react';

interface Props {
  condition: boolean;
  component?: ReactNode;
  children?: ReactNode;
}

export default function FeatureFlag({
  condition,
  component,
  children,
}: Props): ReactElement {
  return (
    <>
      {condition ? (
        <>
          {component}
          {children}
        </>
      ) : null}
    </>
  );
}

export function isFirealertFiresEnabled() {
  let isEnable = false;

  const envFirealertFires = process.env.NEXT_PUBLIC_ENABLE_FIREALERT_FIRES;
  if (envFirealertFires?.trim().toLowerCase() === 'true') isEnable = true;

  const qsFirealertFires = new URLSearchParams(window.location.search);
  if (qsFirealertFires.get('fa-fires')?.toLowerCase() === 'true')
    isEnable = true;

  // console.log({ isFirealertFiresEnabled: isEnable });
  return isEnable;
}
