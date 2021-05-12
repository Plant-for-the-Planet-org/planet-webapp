import React, { ReactElement } from 'react';
import Footer from '../../src/features/common/Layout/Footer';
import TreeMapper from '../../src/features/user/Account/screens/TreeMapper';
import AccountHeader from '../../src/features/common/Layout/Header/accountHeader';
import i18next from '../../i18n';
import styles from '../../src/features/user/Account/styles/AccountNavbar.module.scss';

const { useTranslation } = i18next;

interface Props { }

function History({ }: Props): ReactElement {
  const { t } = useTranslation(['me']);
  return (
    <>
      <div className={styles.accountsPage}>
        <AccountHeader page={'treemapper'} pageTitle={t('me:myAccount')} />
        <TreeMapper />
      </div>

      <Footer />
    </>
  );
}

export default History;
