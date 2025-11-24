import type { CountryCode, UnitTypes } from '@planet-sdk/common';
import type { CountryTreeDataItem } from './sections/CountryLeaderboard';

import { useEffect, useState } from 'react';
import { useTenant } from '../../../features/common/Layout/TenantContext';
import Banner from './sections/Banner';
import CountryLeaderboard from './sections/CountryLeaderboard';
import ResponsibilityStatement from './sections/ResponsibilityStatement';
import PartnershipShowcase from './sections/PartnershipShowcase';
import Sustainability from './sections/Sustainability';
import Footer from '../../../features/common/Layout/Footer';
import styles from './Home.module.scss';

type StatsDataItem = {
  country: CountryCode | null;
  unit_type: UnitTypes;
  /** units are returned as strings and should be converted to numbers */
  units: string;
};

const Home = () => {
  const { tenantConfig } = useTenant();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [totalTrees, setTotalTrees] = useState(0);
  const [countryWiseTrees, setCountryWiseTrees] = useState<
    CountryTreeDataItem[]
  >([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(
          // TODO: replace tenant id hardcoding with dynamic id
          // `${process.env.WEBHOOK_URL}/db39bbb3-d0e2-4d91-b875-d3914914f439/tenant-donation-stats/${tenantConfig.id}`
          `${process.env.WEBHOOK_URL}/db39bbb3-d0e2-4d91-b875-d3914914f439/tenant-donation-stats/ten_3hEjJCBs`
        );
        if (res.ok && res.status === 200) {
          const statsData = (await res.json()) as StatsDataItem[];
          let totalTreesLocal = 0;
          const countryWiseTreesLocal: CountryTreeDataItem[] = [];
          statsData.forEach((item) => {
            if (item.unit_type === 'tree') {
              const units = parseInt(item.units);
              totalTreesLocal += units;
              if (item.country) {
                countryWiseTreesLocal.push({
                  country: item.country,
                  treeCount: units,
                });
              }
            }
          });
          setIsDataLoaded(true);
          setTotalTrees(totalTreesLocal);
          setCountryWiseTrees(countryWiseTreesLocal);
        }
      } catch (error) {
        console.error('Error loading tenant donation stats:', error);
      }
    }
    loadStats();
  }, [tenantConfig.id]);

  return (
    <main className={styles.home}>
      <Banner totalTrees={totalTrees} isDataLoaded={isDataLoaded} />
      <CountryLeaderboard
        countryWiseTrees={countryWiseTrees}
        isDataLoaded={isDataLoaded}
      />
      <ResponsibilityStatement />
      <PartnershipShowcase />
      <Sustainability />
      <Footer />
    </main>
  );
};
export default Home;
