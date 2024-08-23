import React from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import { ProjectExpense } from '@planet-sdk/common';
import getFormatedCurrency from '../../../../../utils/countryCurrency/getFormattedCurrency';
import { useLocale } from 'next-intl';
import DownloadsButton from './DownloadButton';
import DownloadsLabel from './DownloadsLabel';
import { getPDFFile } from '../../../../../utils/getImageURL';

interface Props {
  spendings: ProjectExpense[];
}

const ProjectSpendingItem = ({ spendings }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;
  const locale = useLocale();

  return (
    <div className={styles.spendingsContainer}>
      {spendings?.map((expense) => (
        <div className={styles.spendingDetail} key={expense.id}>
          {isMobile ? (
            <DownloadsLabel>
              <time>{expense.year}</time>
            </DownloadsLabel>
          ) : (
            <DownloadsLabel>
              <a
                href={getPDFFile('projectExpense', expense.pdf)}
                target="_blank"
                rel="noreferrer"
              >
                {expense.year}
              </a>
            </DownloadsLabel>
          )}

          <div>{getFormatedCurrency(locale, 'EUR', expense.amount)}</div>

          <DownloadsButton />
        </div>
      ))}
    </div>
  );
};

export default ProjectSpendingItem;
