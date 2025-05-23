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
