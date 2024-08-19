import React from 'react';
import styles from '../../features/projectsV2/ProjectDetails/styles/ProjectInfo.module.scss';
import { ProjectExpense } from '@planet-sdk/common';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { useLocale } from 'next-intl';
import DownloadButton from './DownloadButton';
import DownloadsLabel from './DownloadsLabel';

interface Props {
  spendings: ProjectExpense[];
}

const ProjectSpendingItem = ({ spendings }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;
  const locale = useLocale();

  return (
    <div className={styles.spendingsContainer}>
      {spendings.map((expense) => (
        <div className={styles.spendingDetail} key={expense.id}>
          {isMobile ? (
            <DownloadsLabel>
              <time>{expense.year}</time>
            </DownloadsLabel>
          ) : (
            <DownloadsLabel>
              <a href="#" target="_blank" rel="noreferrer">
                {expense.year}
              </a>
            </DownloadsLabel>
          )}

          <div>{getFormatedCurrency(locale, 'EUR', expense.amount)}</div>

          <DownloadButton />
        </div>
      ))}
    </div>
  );
};

export default ProjectSpendingItem;
