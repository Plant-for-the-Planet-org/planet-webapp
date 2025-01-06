import type { ReactNode, MouseEventHandler } from 'react';

import React from 'react';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  id?: string;
  width?: string;
};

export default function MaterialButton({
  children,
  onClick,
  id,
  width,
}: Props) {
  return (
    <button
      id={id ? id : undefined}
      onClick={onClick}
      className="primaryButton"
      style={{ width: width ? width : '100%' }}
      data-test-id={id ? id : undefined}
    >
      {children}
    </button>
  );
}
