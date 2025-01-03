import type { ReactElement } from 'react';

import CenteredContainer from '../../../common/Layout/CenteredContainer';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';

const NoTransactionsFound = (): ReactElement => {
  return (
    <CenteredContainer className="CenteredContainer--small">
      <TransactionsNotFound />
    </CenteredContainer>
  );
};

export default NoTransactionsFound;
