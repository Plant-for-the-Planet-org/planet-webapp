import React from 'react';
import styles from './ProjectInfo.module.scss';
import { ProjectExpense } from '@planet-sdk/common';
import CertificationLabel from './CertificationLabel';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { renderDownloadIcon } from './ExternalCertification';
import { useTranslation } from 'next-i18next';

interface Props {
  spendings: ProjectExpense[];
}

const ProjectSpendingCertificationItem = ({ spendings }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;
  const { i18n } = useTranslation();

  return (
    <div className={styles.spendingsContainer}>
      {spendings.map((expense) => (
        <div className={styles.spendingDetail} key={expense.id}>
          {isMobile ? (
            <CertificationLabel>
              <time>{expense.year}</time>
            </CertificationLabel>
          ) : (
            <CertificationLabel>
              <a href="#" target="_blank" rel="noreferrer">
                {expense.year}
              </a>
            </CertificationLabel>
          )}

          <div>{getFormatedCurrency(i18n.language, 'EUR', expense.amount)}</div>

          {renderDownloadIcon()}
        </div>
      ))}
    </div>
  );
};

export default ProjectSpendingCertificationItem;
