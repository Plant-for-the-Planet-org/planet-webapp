import type { ReactElement, ReactNode } from 'react';

interface Props {
  condition: boolean;
  children?: ReactNode;
}

export default function FeatureFlag({
  condition,
  children,
}: Props): ReactElement {
  return <>{condition ? <>{children}</> : null}</>;
}

export function isFirealertFiresEnabled() {
  const isEnvVariableEnabled =
    process.env.NEXT_PUBLIC_ENABLE_FIREALERT_FIRES?.trim().toLowerCase() ===
    'true';
  const isQueryStringEnabled =
    new URLSearchParams(window.location.search)
      .get('fa-fires')
      ?.toLowerCase() === 'true';

  return isEnvVariableEnabled || isQueryStringEnabled;
}
