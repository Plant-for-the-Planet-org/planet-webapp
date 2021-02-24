import React, { ReactElement } from 'react'
import styles from './QuarterlyReports.module.scss'
import i18next from '../../../../../i18n';
import AnimatedButton from '../../../../features/common/InputTypes/AnimatedButton';
import { getRequest } from '../../../../utils/apiRequests/api';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

interface Props {

}

const { useTranslation } = i18next;
function QuarterlyReports({ }: Props): ReactElement {
  const { t, ready, i18n } = useTranslation(['leaderboard', 'common']);

  const [reports, setreports] = React.useState([]);
  const [baseValue,setBaseValue] = React.useState(0);
  React.useEffect(() => {
    async function fetchReports() {
      const reports = await getRequest('/app/reports/donationsQuarterly');


      const dummy = [
        {
          "year": "2021",
          "quarter": "1",
          "treesTotal": 110877,
          "treesDonated": [
            {
              "id": "proj_08KPr5UC3XliXwWgDqNgiIHs",
              "name": "Eden Reforestation Projects - Kenya",
              "trees": 28318
            },
            {
              "id": "proj_WZkyugryh35sMmZMmXCwq7YY",
              "name": "Yucat\u00e1n Reforestation",
              "trees": 23371
            },
            {
              "id": "proj_rgw0BJclVAad1iXPB2dYrUze",
              "name": "Kasungu Indigenous Reforestation Project - GPS VALIDATED",
              "trees": 10684
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 48504
            }
          ]
        },
        {
          "year": "2020",
          "quarter": "4",
          "treesTotal": 1592396,
          "treesDonated": [
            {
              "id": "proj_eKBbIt7Bzavu9o7xzCAqjS2t",
              "name": "Volcano Valley Reforestation",
              "trees": 1146181
            },
            {
              "id": "proj_WZkyugryh35sMmZMmXCwq7YY",
              "name": "Yucat\u00e1n Reforestation",
              "trees": 112974
            },
            {
              "id": "proj_08KPr5UC3XliXwWgDqNgiIHs",
              "name": "Eden Reforestation Projects - Kenya",
              "trees": 75706
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 257535
            }
          ]
        },
        {
          "year": "2020",
          "quarter": "3",
          "treesTotal": 3010766,
          "treesDonated": [
            {
              "id": "proj_itaSbQGmpsGPhXkBl9l7iJWk",
              "name": "Restoration of Forest Landscapes through Assisted Natural Regeneration in Western Tanzania",
              "trees": 800150
            },
            {
              "id": "proj_js644aJ4g1UWa3EhxwkzCMi9",
              "name": "Indiana Prescribed Fire Oak Regeneration",
              "trees": 500000
            },
            {
              "id": "proj_uEBFGjRtvGKETOQN3lJ8vC2A",
              "name": "Reforest Toluca",
              "trees": 432100
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 1278516
            }
          ]
        },
        {
          "year": "2020",
          "quarter": "2",
          "treesTotal": 167225,
          "treesDonated": [
            {
              "id": "proj_mgjsDUPjkmy5dd75RgicoblV",
              "name": "Eden Reforestation Projects - Haiti",
              "trees": 75667
            },
            {
              "id": "proj_HbXtaPq6YVgvbDi8HC3Varsi",
              "name": "Econfina Creek Water Management Area",
              "trees": 50000
            },
            {
              "id": "proj_WZkyugryh35sMmZMmXCwq7YY",
              "name": "Yucat\u00e1n Reforestation",
              "trees": 17670
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 23888
            }
          ]
        },
        {
          "year": "2020",
          "quarter": "1",
          "treesTotal": 77936,
          "treesDonated": [
            {
              "id": "proj_mgjsDUPjkmy5dd75RgicoblV",
              "name": "Eden Reforestation Projects - Haiti",
              "trees": 32723
            },
            {
              "id": "proj_WZkyugryh35sMmZMmXCwq7YY",
              "name": "Yucat\u00e1n Reforestation",
              "trees": 19671
            },
            {
              "id": "proj_7lU9jVmjA1Ch2EjuPyz03nhk",
              "name": "Mphompha Planting Trees project \u2013 GPS VALIDATED",
              "trees": 8420
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 17122
            }
          ]
        },
        {
          "year": "2019",
          "quarter": "4",
          "treesTotal": 1472061,
          "treesDonated": [
            {
              "id": "proj_eKBbIt7Bzavu9o7xzCAqjS2t",
              "name": "Volcano Valley Reforestation",
              "trees": 972974
            },
            {
              "id": "proj_mgjsDUPjkmy5dd75RgicoblV",
              "name": "Eden Reforestation Projects - Haiti",
              "trees": 199597
            },
            {
              "id": "proj_WZkyugryh35sMmZMmXCwq7YY",
              "name": "Yucat\u00e1n Reforestation",
              "trees": 175899
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 123591
            }
          ]
        },
        {
          "year": "2019",
          "quarter": "3",
          "treesTotal": 268420,
          "treesDonated": [
            {
              "id": "proj_mgjsDUPjkmy5dd75RgicoblV",
              "name": "Eden Reforestation Projects - Haiti",
              "trees": 121218
            },
            {
              "id": "proj_WZkyugryh35sMmZMmXCwq7YY",
              "name": "Yucat\u00e1n Reforestation",
              "trees": 80226
            },
            {
              "id": "proj_7lU9jVmjA1Ch2EjuPyz03nhk",
              "name": "Mphompha Planting Trees project \u2013 GPS VALIDATED",
              "trees": 33153
            },
            {
              "id": 0,
              "name": "Other",
              "trees": 33823
            }
          ]
        }
      ];

      const maxValue = dummy.reduce((a,b)=>a.treesTotal>b.treesTotal?a:b).treesTotal;
      setBaseValue(maxValue);
      if (dummy) {
        setreports(dummy)
      }
    }
    fetchReports();
  }, [])

  return ready ? (
    <div className={styles.reportsSection}>
      <div className={styles.reportsTitle}>
        <h2>{t('leaderboard:quarterlyReportsTitle')}</h2>
      </div>

      <div className={styles.allReports}>
        {reports && reports.length > 0 ? (
          reports.map((report,index) => {
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
                    {report.treesDonated.map((project,index)=>{
                      let opacity = (100 - (index * 14))/100;
                      return(
                        <div key={index} className={styles.projectSegmentContainer} style={{width:`${(project.trees/baseValue)*100}%`}}>
                        <div className={styles.projectSegment} style={{opacity:opacity}}>
                        </div>
                        <div className={styles.projectName}>{project.name} : {" "}
                        {t('leaderboard:treesTotal', {
                            count: getFormattedNumber(i18n.language, project.trees), 
                        })}
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

      <a href="https://www.plant-for-the-planet.org/en/donation" target="_blank">
        <AnimatedButton className={styles.continueButton}>
          {t('leaderboard:supportUs')}
        </AnimatedButton>
      </a>
      
    </div>
  ) : <></>;
}

export default QuarterlyReports
