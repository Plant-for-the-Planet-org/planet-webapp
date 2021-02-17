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
        'Donate trees to make Salesforce Iberia`s forest grow!',
      name: 'IberiaForce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link: 'https://trees.salesforce.com/s/iberiaforce',
      guid: 'iberiaforce'
    },
    {
      id: 2,
      stellarForceDescription:'Donate trees to make Salesforce Italy`s forest grow!',
      name: 'ItalyForce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link: 'https://trees.salesforce.com/s/italyforce',
      guid: 'italyforce'
    },
    {
      id: 3,
      stellarForceDescription:'Donate trees to make Salesforce Israel`s forest grow!',
      name: 'IsraelForce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/israelforce',
      guid: 'israelforce'
    },
    {
      id: 4,
      stellarForceDescription:'Donate trees to make Salesforce France`s forest grow!',
      name: 'FranceForce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/franceforce',
      guid: 'franceforce'
    },

    {
      id: 5,
      stellarForceDescription:'Donate trees to make Salesforce Emerging Markets` forest grow!',
      name: 'EmergingForce',
      imagePath: '/tenants/salesforce/images/TreeCounterImage.png',
      link:
        'https://trees.salesforce.com/s/emergingforce',
      guid: 'emergingforce'
    },
    {
      id: 6,
      stellarForceDescription:'Donate trees to make Salesforce Ireland`s forest grow!',
      name: 'IrelandForce',
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
              StellarForestForce
            </h2>
            <br />
            <p className={treeCounterStyles.treeCounterSectionTextPara}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.              <br />
              <br />
              {/* Check out the “Donate” tab to see some of the places where we’re supporting tree planting organizations and lend your support! The tracker to the right and leaderboard below reflect all the donations made and registered on this platform. Also below, you’ll find examples of our other initiatives as well as resources to get involved. We’ll continue to add projects, programs, and resources so check back often! */}
            </p>
            {/* <button className={styles.buttonStyle}>Join Us</button> */}
          </div>
          <div className={`${gridStyles.colMd6} ${gridStyles.col12} ${treeCounterStyles.treeCounterSection}`}>
            <div className={treeCounterStyles.treeCounterContainer}></div>
            <div className={treeCounterStyles.treeCounter}>
              <TreeCounter title={'trees planted'} target={100000000} planted={0} />
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
