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
import { INITIAL_COUNTRY_TREES } from './constants/initialCountryTrees';
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
        // Initialize with base values
        const countryTreeMap: Map<CountryCode, number> = new Map();

        Object.entries(INITIAL_COUNTRY_TREES).forEach(([code, data]) => {
          if (data) {
            countryTreeMap.set(code as CountryCode, data.trees);
          }
        });

        const res = await fetch(
          `${process.env.WEBHOOK_URL}/db39bbb3-d0e2-4d91-b875-d3914914f439/tenant-donation-stats/${tenantConfig.id}`
        );

        if (res.ok && res.status === 200) {
          const statsData = (await res.json()) as StatsDataItem[];

          // Add API data to initial values
          statsData.forEach((item) => {
            if (item.unit_type === 'tree' && item.country) {
              const units = parseInt(item.units);
              const currentCount = countryTreeMap.get(item.country) || 0;
              countryTreeMap.set(item.country, currentCount + units);
            }
          });
        }

        // Convert map to array and sort by tree count (descending)
        const countryWiseTreesLocal: CountryTreeDataItem[] = Array.from(
          countryTreeMap.entries()
        )
          .map(([country, treeCount]) => ({
            country,
            treeCount,
          }))
          .sort((a, b) => b.treeCount - a.treeCount);

        // Calculate total trees
        const totalTreesLocal = countryWiseTreesLocal.reduce(
          (sum, item) => sum + item.treeCount,
          0
        );

        setTotalTrees(totalTreesLocal);
        setCountryWiseTrees(countryWiseTreesLocal);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error loading tenant donation stats:', error);

        // If API fails, use initial values only
        const countryWiseTreesLocal: CountryTreeDataItem[] = [];

        Object.entries(INITIAL_COUNTRY_TREES).forEach(([country, data]) => {
          if (data) {
            countryWiseTreesLocal.push({
              country: country as CountryCode,
              treeCount: data.trees,
            });
          }
        });

        countryWiseTreesLocal.sort((a, b) => b.treeCount - a.treeCount);

        const totalTreesLocal = countryWiseTreesLocal.reduce(
          (sum, item) => sum + item.treeCount,
          0
        );

        setIsDataLoaded(true);
        setTotalTrees(totalTreesLocal);
        setCountryWiseTrees(countryWiseTreesLocal);
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
