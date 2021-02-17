import styles from './../styles/StellarForce.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import TreeCounter from '../../TreeCounter/TreeCounter';
import treeCounterStyles from './../styles/TreeCounter.module.scss';
import SingleForce from './SingleForce'
export default function StellarForce() {

  const stellarForces = [
    {
      id: 1,
      stellarForceDescription:
        'Since 2017 we’ve supported carbon projects, such as restoring mangrove forests in Myanmar while working with the local population to adapt to more sustainable practices.',
      name: 'Iberiaforce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link: 'https://trees.salesforce.com/s/iberiaforce',
      guid: 'iberiaforce'
    },
    {
      id: 2,
      stellarForceDescription:
        'Salesforce supports the four Together With Nature Principles to responsibly tackle the climate crisis, restore biodiversity, and benefit planetary health and human wellbeing.',
      name: 'Italyforce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link: 'https://trees.salesforce.com/s/italyforce',
      guid: 'italyforce'
    },
    {
      id: 3,
      stellarForceDescription:
        'Salesforce technology powers this digital platform that crowdsources innovations from ecopreneurs, who are developing solutions to meet the trillion trees goal.',
      name: 'Israelforce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/israelforce',
      guid: 'israelforce'
    },
    {
      id: 4,
      stellarForceDescription:
        'We pledged with other U.S.-based organizations to support almost one billion trees and accelerate the trillion trees movement.',
      name: 'Franceforce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/franceforce',
      guid: 'franceforce'
    },

    {
      id: 5,
      stellarForceDescription:
        'We pledged with other U.S.-based organizations to support almost one billion trees and accelerate the trillion trees movement.',
      name: 'Emergingforce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/emergingforce',
      guid: 'emergingforce'
    },
    {
      id: 6,
      stellarForceDescription:
        'Salesforce technology powers this digital platform that crowdsources innovations from ecopreneurs, who are developing solutions to meet the trillion trees goal.',
      name: 'Irelandforce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/irelandforce',
      guid: 'irelandforce'
    },
  ];

  return (
    <div className={styles.stellarForceSection}>
      <div className={gridStyles.fluidContainer}>
        <div className={`${gridStyles.gridRow} ${treeCounterStyles.treeCounterSectionRow}`}>
          <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${treeCounterStyles.treeCounterSectionText}`}>
            <h2 className={treeCounterStyles.treeCounterSectionTextHeader}>
              StellarForce
            </h2>
            <br />
            <p className={treeCounterStyles.treeCounterSectionTextPara}>
              Even though our journey is just starting, we know it will take the full power of Salesforce - including our technology, capital, influence, and network - to get there. And we know there’s no time to waste. We know we’ll have to refine our programs and methodology over time, by sharing with and learning from others. That’s why we’ve launched this resource.
              <br />
              <br />
              {/* Check out the “Donate” tab to see some of the places where we’re supporting tree planting organizations and lend your support! The tracker to the right and leaderboard below reflect all the donations made and registered on this platform. Also below, you’ll find examples of our other initiatives as well as resources to get involved. We’ll continue to add projects, programs, and resources so check back often! */}
            </p>
            {/* <button className={styles.buttonStyle}>Join Us</button> */}
          </div>
          <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${treeCounterStyles.treeCounterSection}`}>
            <div className={treeCounterStyles.treeCounterContainer}></div>
            <div className={treeCounterStyles.treeCounter}>
              <TreeCounter target={100000000} planted={333333} />
            </div>
            <img
              className={treeCounterStyles.treeCounterImage}
              src={'/tenants/salesforce/images/TreeCounterImage.png'}
              alt="Treecounter Image"
            />
          </div>
        </div>
      </div>
      <div className={`${gridStyles.gridRow} ${styles.stellarForceContainer}`}>
        {stellarForces.map((stellarForce) => {
          return (
            <SingleForce stellarForce={stellarForce} />
          )
        })}
      </div>
    </div>
  );
}
