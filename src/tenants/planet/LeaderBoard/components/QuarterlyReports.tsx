import React, { ReactElement } from 'react'
import styles from './QuarterlyReports.module.scss'
import i18next from '../../../../../i18n';
import AnimatedButton from '../../../../features/common/InputTypes/AnimatedButton';
import { getRequest } from '../../../../utils/apiRequests/api';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import { useRouter } from 'next/router';

interface Props {

}

const { useTranslation } = i18next;
function QuarterlyReports({ }: Props): ReactElement {
  const { t, ready, i18n } = useTranslation(['leaderboard', 'common']);
  const router = useRouter();
  const [reports, setreports] = React.useState([]);
  const [baseValue, setBaseValue] = React.useState(0);
  React.useEffect(() => {
    async function fetchReports() {
      const newreports = await getRequest('/app/reports/donationsQuarterly');
      const maxValue = newreports.reduce((a, b) => a.treesTotal > b.treesTotal ? a : b).treesTotal;
      setBaseValue(maxValue);
      setreports(newreports);
    }
    fetchReports();
  }, []);

  return ready ? (
    <div className={styles.reportsSection}>
      <div className={styles.reportsTitle}>
        <h2>{t('leaderboard:quarterlyReportsTitle')}</h2>
      </div>

      <div className={styles.allReports}>
        {reports && reports.length > 0 ? (
          reports.map((report, index) => {
            return (
              <div key={index} className={styles.singleQuarter}>
                <p className={styles.quarterTitle}>
                  {index === 0 ? (
                    t('leaderboard:current')
                  ) : (
                      `Q${report.quarter} ${report.year}`
                    )}

                </p>
                {report.treesDonated && report.treesDonated.length > 0 ? (
                  <div className={styles.reportContainer}>
                    {report.treesDonated.map((project, index) => {
                      const opacity = (100 - (index * 14)) / 100;
                      return (
                        <div 
                          onClick={() => {
                            project.id !== 0 ?
                            router.push('/[p]', `/${project.id}`, {
                              shallow: true,
                            }) : {}
                          }} 
                          key={index} 
                          className={styles.projectSegmentContainer} 
                          style={{ width: `${(project.trees / baseValue) * 100}%` }}>
                          
                          <div className={styles.projectSegment} style={{ opacity: opacity }}/>
                          <div className={styles.projectName}>{project.name} {" "}
                            <span>{t('leaderboard:treesTotal', {
                              count: getFormattedNumber(i18n.language, project.trees),
                            })}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
                <p className={styles.totalTrees}>
                  {t('leaderboard:treesTotal', {
                    count: getFormattedNumber(i18n.language, report.treesTotal),
                  })}
                </p>
              </div>
            )
          })
        ) : null}

      </div>


      <p className={styles.reportDescription}>{t('leaderboard:reportDescription')}</p>

      <a rel="noreferrer" href="https://www.plant-for-the-planet.org/en/donation" target="_blank">
        <AnimatedButton className={styles.continueButton}>
          {t('leaderboard:supportUs')}
        </AnimatedButton>
      </a>

    </div>
  ) : <></>;
}

export default QuarterlyReports
