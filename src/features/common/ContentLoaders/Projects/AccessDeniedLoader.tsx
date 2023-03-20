import React, { ReactElement } from 'react';
import AccessDenied from '../../../../../public/assets/images/icons/manageProjects/AccessDenied';

interface Props {}

function AccessDeniedLoader({}: Props): ReactElement {
  return (
    <div className="accessDeniedContainer">
      <AccessDenied width={'320px'} height={'229px'} />
      <h2>You don’t have access to this page</h2>
    </div>
  );
}

export default AccessDeniedLoader;
