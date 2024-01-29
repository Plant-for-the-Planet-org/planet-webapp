'use client';
import { FC, SetStateAction } from 'react';
import NavMenuItem, {
  NavMenuItemConfig,
} from '../../../../src/app-src/dashboard/NavMenuItem';
import UserIcon from '../../../../public/assets/images/icons/Sidebar/UserIcon';
import RegisterTreeIcon from '../../../../public/assets/images/icons/Sidebar/RegisterIcon';
import DonateIcon from '../../../../public/assets/images/icons/Sidebar/DonateIcon';
import MapIcon from '../../../../public/assets/images/icons/Sidebar/MapIcon';
import PlanetCashIcon from '../../../../public/assets/images/icons/Sidebar/PlanetCashIcon';
import WidgetIcon from '../../../../public/assets/images/icons/Sidebar/Widget';
import SettingsIcon from '../../../../public/assets/images/icons/Sidebar/SettingsIcon';
import TreeMapperIcon from '../../../../public/assets/images/icons/Sidebar/TreeMapperIcon';
import styles from './DashboardLayout.module.scss';
import LogoutButton from '../../../../src/app-src/dashboard/LogoutButton';
import PlatformDocsLink from '../../../../src/app-src/dashboard/PlatformDocsLink';
import SupportPin from '../../../../src/app-src/dashboard/SupportPin';

const DashboardLayout: FC = ({ children }) => {
  const navMenu: NavMenuItemConfig[] = [
    {
      key: 1,
      // title: t('me:profile'),
      title: 'Profile',
      path: '/profile',
      icon: <UserIcon />,
    },
    {
      key: 2,
      // title: t('me:registerTrees'),
      title: 'Register Trees',
      path: '/profile/register-trees',
      icon: <RegisterTreeIcon />,
    },
    {
      key: 3,
      // title: t('me:payments'),
      title: 'Payments',
      icon: <DonateIcon />,
      // flag: t('me:new'),
      flag: 'New',
      subMenu: [
        {
          // title: t('me:history'),
          title: 'History',
          path: '/profile/history',
        },
        {
          // title: t('me:recurrency'),
          title: 'Recurrency',
          path: '/profile/recurrency',
        },
        {
          // title: t('me:managePayouts.menuText'),
          title: 'Manage Payouts',
          path: '/profile/payouts',
          // hideItem: !(user?.type === 'tpo'),
        },
      ],
    },
    {
      key: 4,
      // title: t('treeMapper'),
      title: 'TreeMapper',
      icon: <TreeMapperIcon />,
      // flag: t('me:beta'),
      flag: 'Beta',
      subMenu: [
        {
          // title: t('me:plantLocations'),
          title: 'Plant Locations',
          path: '/profile/treemapper',
        },
        {
          // title: t('me:mySpecies'),
          title: 'My Species',
          path: '/profile/treemapper/my-species',
          // hideItem: !(user?.type === 'tpo'),
        },
        {
          // title: t('me:import'),
          title: 'Import',
          path: '/profile/treemapper/import',
          // hideItem: !(user?.type === 'tpo'),
        },
        {
          // title: t('me:dataExplorer'),
          title: 'DataExplorer',
          path: '/profile/treemapper/data-explorer',
          // hideItem: !(process.env.ENABLE_ANALYTICS && user?.type === 'tpo'),
        },
      ],
    },
    {
      key: 5,
      // title: t('me:projects'),
      title: 'Projects',
      path: '/profile/projects',
      icon: <MapIcon />,
      accessLevel: ['tpo'],
    },
    {
      key: 6,
      // title: t('me:planetcash.menuText'),
      title: 'PlanetCash',
      icon: <PlanetCashIcon />,
      // flag: t('me:new'),
      flag: 'New',
      subMenu: [
        {
          // title: t('me:planetcash.submenuText'),
          title: 'My PlanetCash',
          path: '/profile/planetcash',
        },
        {
          // title: t('me:bulkCodes'),
          title: 'Certificates & Codes',
          path: '/profile/bulk-codes',
          // flag: t('me:beta'),
          flag: 'Beta',
        },
        {
          // title: t('me:giftFund'),
          title: 'GiftFund',
          path: '/profile/giftfund',
          //For an active PlanetCash account with an empty GiftFund array or if openUnits = 0 for all GiftFunds, it should be hidden
          // hideItem:
          //   !user?.planetCash ||
          //   user?.planetCash?.giftFunds.filter((gift) => gift.openUnits !== 0)
          //     .length == 0,
        },
      ],
    },
    {
      key: 7,
      // title: t('me:widgets'),
      title: 'Widgets',
      icon: <WidgetIcon />,
      subMenu: [
        {
          // title: t('me:embedWidget'),
          title: 'Embed Widget',
          path: '/profile/widgets',
        },
        {
          // title: t('me:donationLink'),
          title: 'Donation Link',
          path: '/profile/donation-link',
          // flag: t('me:new'),
          flag: 'New',
        },
      ],
    },
    {
      key: 8,
      // title: t('me:settings'),
      title: 'Settings',
      icon: <SettingsIcon />,
      subMenu: [
        {
          // title: t('me:editProfile'),
          title: 'Edit Profile',
          path: '/profile/edit',
        },
        {
          // title: t('me:switchUser'),
          title: 'Impersonate User',
          path: '/profile/impersonate-user',
          // hideItem: isImpersonationModeOn || !user?.allowedToSwitch,
        },
        {
          // title: t('me:apiKey'),
          title: 'Api Key',
          path: '/profile/api-key',
        },
        {
          // title: t('me:deleteProfile'),
          title: 'Delete Profile',
          path: '/profile/delete-account',
        },
      ],
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.dashboardSidebar}>
        <section className={styles.navMenu}>
          {navMenu.map((item: NavMenuItemConfig, index) => {
            return (
              <NavMenuItem
                link={item}
                key={index}
                setactiveLink={function (value: SetStateAction<string>): void {
                  throw new Error('Function not implemented.');
                }}
                activeLink={''}
                activeSubMenu={''}
                setActiveSubMenu={function (
                  value: SetStateAction<string>
                ): void {
                  throw new Error('Function not implemented.');
                }}
                user={undefined}
              />
            );
          })}
        </section>
        <section className={styles.moreOptionsMenu}>
          {/* TODOO - Language Switcher */}
          <SupportPin />
          <PlatformDocsLink />
          <LogoutButton />
        </section>
      </nav>
      <main className={styles.dashboardPageWrapper}>{children}</main>
    </div>
  );
};
export default DashboardLayout;
