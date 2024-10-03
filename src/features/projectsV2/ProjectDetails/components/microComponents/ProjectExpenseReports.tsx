import React from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import { ProjectExpense } from '@planet-sdk/common';
import getFormatedCurrency from '../../../../../utils/countryCurrency/getFormattedCurrency';
import { useLocale } from 'next-intl';
import DownloadsButton from './DownloadButton';
import DownloadsLabel from './DownloadsLabel';
import { getPDFFile } from '../../../../../utils/getImageURL';

interface Props {
  expenses: ProjectExpense[];
}

const ProjectExpenseReports = ({ expenses }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;
  const locale = useLocale();

  return (
    <div className={styles.expenseContainer}>
      {expenses?.map((expense) => {
        const pdfUrl = getPDFFile('projectExpense', expense.pdf);
        const formattedAmount = getFormatedCurrency(
          locale,
          'EUR',
          Math.floor(expense.amount)
        ).replace(/\.00$/, '');
        return (
          <div className={styles.expenseDetails} key={expense.id}>
            {isMobile ? (
              <DownloadsLabel>
                <time>{expense.year}</time>
              </DownloadsLabel>
            ) : (
              <DownloadsLabel>
                <a href={pdfUrl} target="_blank" rel="noreferrer">
                  {expense.year}
                </a>
              </DownloadsLabel>
            )}
            <div>{formattedAmount}</div>
            <DownloadsButton pdfUrl={pdfUrl} />
          </div>
        );
      })}
    </div>
  );
};

export default ProjectExpenseReports;
