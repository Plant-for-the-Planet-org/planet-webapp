import type { FC } from 'react';
import type { NavLinkType, SubMenuItemType } from './NavLink';

import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import MenuIcon from '../../../../../public/assets/images/icons/Sidebar/MenuIcon';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import DonateIcon from '../../../../../public/assets/images/icons/Sidebar/DonateIcon';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import MapIcon from '../../../../../public/assets/images/icons/Sidebar/MapIcon';
import PlanetCashIcon from '../../../../../public/assets/images/icons/Sidebar/PlanetCashIcon';
import SettingsIcon from '../../../../../public/assets/images/icons/Sidebar/SettingsIcon';
import UserIcon from '../../../../../public/assets/images/icons/Sidebar/UserIcon';
import WidgetIcon from '../../../../../public/assets/images/icons/Sidebar/Widget';
import { UserProfileLoader } from '../../ContentLoaders/UserProfile/UserProfile';
import { useUserProps } from '../UserPropsContext';
import styles from './UserLayout.module.scss';
import TreeMapperIcon from '../../../../../public/assets/images/icons/Sidebar/TreeMapperIcon';
import RegisterTreeIcon from '../../../../../public/assets/images/icons/Sidebar/RegisterIcon';
import NotionLinkIcon from '../../../../../public/assets/images/icons/Sidebar/NotionLinkIcon';
import SupportPin from '../../../user/Settings/ImpersonateUser/SupportPin';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import IconContainer from './IconContainer';
import LanguageSwitcher from './LanguageSwitcher';
import NavLink from './NavLink';

const UserLayout: FC = ({ children }) => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const router = useRouter();
  const { user, logoutUser, contextLoaded, isImpersonationModeOn } =
    useUserProps();

  // Navigation structure with keys, paths, and submenu configurations
  // Flags can be added to show labels on the right
  const navLinks: NavLinkType[] = useMemo(
    () => [
      {
        key: 'profile',
        title: t('profile'),
        path: '/profile',
        icon: <UserIcon />,
      },
      {
        key: 'register-trees',
        title: t('registerTrees'),
        path: '/profile/register-trees',
        icon: <RegisterTreeIcon />,
      },
      {
        key: 'payments',
        title: t('payments'),
        icon: <DonateIcon />,
        flag: t('new'),
        subMenu: [
          {
            key: 'history',
            title: t('history'),
            path: '/profile/history',
          },
          {
            key: 'recurrency',
            title: t('recurrency'),
            path: '/profile/recurrency',
          },
          {
            key: 'donation-receipts',
            title: t('donationReceipts'),
            path: '/profile/donation-receipt',
            matchPattern: 'prefix', // Matches /profile/donation-receipt and /profile/donation-receipt/*
          },
          {
            key: 'payouts',
            title: t('managePayouts.menuText'),
            path: '/profile/payouts',
            hideItem: !(user?.type === 'tpo'),
            matchPattern: 'prefix', // Matches /profile/payouts and /profile/payouts/*
          },
        ],
      },
      {
        key: 'treemapper',
        title: t('treemapper'),
        icon: <TreeMapperIcon />,
        flag: t('beta'),
        subMenu: [
          {
            key: 'plant-locations',
            title: t('plantLocations'),
            path: '/profile/treemapper',
          },
          {
            key: 'my-species',
            title: t('mySpecies'),
            path: '/profile/treemapper/my-species',
            hideItem: !(user?.type === 'tpo'),
          },
          {
            key: 'import',
            title: t('import'),
            path: '/profile/treemapper/import',
            hideItem: !(user?.type === 'tpo'),
          },
          {
            key: 'data-explorer',
            title: t('dataExplorer'),
            path: '/profile/treemapper/data-explorer',
            hideItem: !(process.env.ENABLE_ANALYTICS && user?.type === 'tpo'),
          },
        ],
      },
      {
        key: 'projects',
        title: t('projects'),
        path: '/profile/projects',
        icon: <MapIcon />,
        accessLevel: ['tpo'],
        matchPattern: 'prefix', // Now projects will match /profile/projects/new-project
      },
      {
        key: 'planet-cash',
        title: t('planetCash.menuText'),
        icon: <PlanetCashIcon />,
        flag: t('new'),
        subMenu: [
          {
            key: 'planetcash',
            title: t('planetCash.submenuText'),
            path: '/profile/planetcash',
            matchPattern: 'prefix', // Matches /profile/planetcash and /profile/planetcash/*
          },
          {
            key: 'bulk-codes',
            title: t('bulkCodes'),
            path: '/profile/bulk-codes',
            flag: t('beta'),
            matchPattern: 'prefix', // Matches /profile/bulk-codes and /profile/bulk-codes/*
          },
          {
            key: 'gift-fund',
            title: t('giftFund'),
            path: '/profile/giftfund',
            //For an active PlanetCash account with an empty GiftFund array or if openUnits = 0 for all GiftFunds, it should be hidden
            hideItem:
              !user?.planetCash ||
              user?.planetCash?.giftFunds.filter((gift) => gift.openUnits !== 0)
                .length == 0,
          },
        ],
      },
      {
        key: 'widgets',
        title: t('widgets'),
        icon: <WidgetIcon />,
        subMenu: [
          {
            key: 'embed-widget',
            title: t('embedWidget'),
            path: '/profile/widgets',
          },
          {
            key: 'donation-link',
            title: t('donationLink'),
            path: '/profile/donation-link',
            flag: t('new'),
          },
        ],
      },
      {
        key: 'settings',
        title: t('settings'),
        icon: <SettingsIcon />,
        subMenu: [
          {
            key: 'edit-profile',
            title: t('editProfile'),
            path: '/profile/edit',
          },
          {
            key: 'switch-user',
            title: t('switchUser'),
            path: '/profile/impersonate-user',
            hideItem: isImpersonationModeOn || !user?.allowedToSwitch,
          },
          {
            key: 'api-key',
            title: t('apiKey'),
            path: '/profile/api-key',
          },
          {
            key: 'delete-profile',
            title: t('deleteProfile'),
            path: '/profile/delete-account',
          },
        ],
      },
    ],
    [t, user, locale, isImpersonationModeOn]
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMenuKey, setCurrentMenuKey] = useState<string>('profile');
  const [currentSubMenuKey, setCurrentSubMenuKey] = useState('');

  useEffect(() => {
    // Determine which menu/submenu should be highlighted based on current route
    function identifyActiveMenu() {
      if (!router.asPath) return;

      let isMatchFound = false;
      // Extract the pathname without query parameters for cleaner matching
      const currentPath = router.asPath.split('?')[0];

      for (const link of navLinks) {
        // Checks whether the path belongs to main menu or submenu
        if (link.path) {
          const fullMainPath = `/${locale}${link.path}`;
          let mainMenuMatches = false;

          // Check for exact match first
          if (currentPath === fullMainPath) {
            mainMenuMatches = true;
          }
          // Check for prefix match if specified
          else if (
            link.matchPattern === 'prefix' &&
            currentPath.startsWith(fullMainPath)
          ) {
            mainMenuMatches = true;
          }

          if (mainMenuMatches) {
            setCurrentMenuKey(link.key);
            setCurrentSubMenuKey('');
            isMatchFound = true;
            break;
          }
        }

        // Then check submenu items
        if (link.subMenu && link.subMenu.length > 0) {
          const subMenuItem = link.subMenu.find(
            (subMenuItem: SubMenuItemType) => {
              const fullSubPath = `/${locale}${subMenuItem.path}`;

              // Check for exact match first
              if (currentPath === fullSubPath) {
                return true;
              }

              // Check for prefix match if specified
              if (subMenuItem.matchPattern === 'prefix') {
                return currentPath.startsWith(fullSubPath);
              }

              return false;
            }
          );
          if (subMenuItem) {
            setCurrentMenuKey(link.key);
            setCurrentSubMenuKey(subMenuItem.key);
            isMatchFound = true;
            break;
          }
        }

        // Finally check hasRelatedLinks (legacy behavior)
        if (
          !isMatchFound &&
          link.hasRelatedLinks &&
          link.path &&
          currentPath.includes(`/${locale}${link.path}`)
        ) {
          setCurrentMenuKey(link.key);
          setCurrentSubMenuKey('');
          isMatchFound = true;
          break;
        }
      }

      // Only set default if no match was found
      if (!isMatchFound) {
        setCurrentMenuKey('profile');
        setCurrentSubMenuKey('');
      }
    }

    identifyActiveMenu();
  }, [router.asPath, locale, navLinks]);

  useEffect(() => {
    if (contextLoaded) {
      // Redirect user to desired page after login
      if (!user) {
        if (router.asPath) localStorage.setItem('redirectLink', router.asPath);
        router.push('/login');
      }
    }
  }, [contextLoaded, user, router]);

  return user ? (
    <div className={styles.profilePageContainer}>
      <div
        key={'hamburgerIcon'}
        className={`${styles.hamburgerIcon}`}
        onClick={() => setIsMobileMenuOpen(true)}
        style={{ marginTop: isImpersonationModeOn ? '47px' : '' }}
      >
        <MenuIcon />
      </div>
      <div
        className={`${
          isImpersonationModeOn
            ? `${styles.sidebarModified}`
            : `${styles.sidebar}`
        } ${!isMobileMenuOpen ? styles.menuClosed : ''}`}
      >
        <div className={styles.navLinksContainer}>
          <>
            <div key={'closeMenu'} className={`${styles.closeMenu}`}>
              <div
                className={`${styles.navLink}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BackArrow />
                <button className={styles.navLinkTitle}>{t('close')}</button>
              </div>
            </div>
            {navLinks.map((link: NavLinkType, index: number) => (
              <NavLink
                link={link}
                setCurrentMenuKey={setCurrentMenuKey}
                currentMenuKey={currentMenuKey}
                currentSubMenuKey={currentSubMenuKey}
                setCurrentSubMenuKey={setCurrentSubMenuKey}
                user={user}
                key={index}
                closeMenu={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </>
        </div>

        <div>
          <LanguageSwitcher />

          {!isImpersonationModeOn && (
            <div className={styles.navLink}>
              <IconContainer>
                <FiberPinIcon />
              </IconContainer>
              <SupportPin />
            </div>
          )}
          <div className={styles.navLink}>
            <IconContainer>
              <NotionLinkIcon />
            </IconContainer>
            <button
              onClick={() =>
                window.open(
                  'https://plantfortheplanet.notion.site/Public-Documentation-Plant-for-the-Planet-Platform-04af8ed821b44d358130142778d79e01',
                  '_blank'
                )
              }
              className={styles.navLinkTitle}
            >
              {t('document')}
            </button>
          </div>
          <div
            className={styles.navLink}
            //Log out user and clear impersonation data
            onClick={() => {
              localStorage.removeItem('impersonationData');
              logoutUser(`${window.location.origin}/`);
            }}
          >
            <IconContainer>
              <LogoutIcon />
            </IconContainer>
            <button className={styles.navLinkTitle}>{t('logout')}</button>
          </div>
        </div>
      </div>
      <div
        className={`${styles.profilePageWrapper} ${
          isImpersonationModeOn ? ` ${styles.profileImpersonation}` : ''
        }`}
      >
        {children}
      </div>
    </div>
  ) : (
    <UserProfileLoader />
  );
};

export default UserLayout;
