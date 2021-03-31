import React, { ReactElement } from 'react';
import Footer from '../../src/features/common/Layout/Footer';
import Account from '../../src/features/user/Account/screens';

interface Props {}

function History({}: Props): ReactElement {
  return (
    <div>
      <Account />
      <Footer />
    </div>
  );
}

export default History;
