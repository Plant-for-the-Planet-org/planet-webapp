import type { User } from '@planet-sdk/common/build/types/user';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';

import router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import MenuIcon from '../../../../../public/assets/images/icons/Sidebar/MenuIcon';
import DownArrow from '../../../../../public/assets/images/icons/DownArrow';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import DonateIcon from '../../../../../public/assets/images/icons/Sidebar/DonateIcon';
import GlobeIcon from '../../../../../public/assets/images/icons/Sidebar/Globe';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import MapIcon from '../../../../../public/assets/images/icons/Sidebar/MapIcon';
import PlanetCashIcon from '../../../../../public/assets/images/icons/Sidebar/PlanetCashIcon';
import SettingsIcon from '../../../../../public/assets/images/icons/Sidebar/SettingsIcon';
import UserIcon from '../../../../../public/assets/images/icons/Sidebar/UserIcon';
import WidgetIcon from '../../../../../public/assets/images/icons/Sidebar/Widget';
import { UserProfileLoader } from '../../ContentLoaders/UserProfile/UserProfile';
import SelectLanguageAndCountry from '../Footer/SelectLanguageAndCountry';
import { useUserProps } from '../UserPropsContext';
import styles from './UserLayout.module.scss';
import TreeMappperIcon from '../../../../../public/assets/images/icons/Sidebar/TreeMapperIcon';
import RegisterTreeIcon from '../../../../../public/assets/images/icons/Sidebar/RegisterIcon';
import NotionLinkIcon from '../../../../../public/assets/images/icons/Sidebar/NotionLinkIcon';
import SupportPin from '../../../user/Settings/ImpersonateUser/SupportPin';
import FiberPinIcon from '@mui/icons-material/FiberPin';

interface SubMenuItemType {
  title: string;
  path: string;
  flag?: string;
  hideItem?: boolean;
}

interface NavLinkType {
  key: number;
  title: string;
  path?: string; // The question mark makes the 'path' property optional
  icon: ReactNode;
  flag?: string;
  accessLevel?: string[];
  hideSubMenu?: boolean;
  subMenu?: SubMenuItemType[];
  hideItem?: boolean;
  hasRelatedLinks?: boolean;
}

function LanguageSwitcher() {
  const locale = useLocale();

  const [language, setLanguage] = useState(locale);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState('DE');

  useEffect(() => {
    if (typeof Storage !== 'undefined') {
      //fetching language from browser's local storage
      if (localStorage.getItem('language')) {
        const langCode = localStorage.getItem('language') || 'en';
        if (langCode) setLanguage(langCode.toLowerCase());
      }
    }
  }, [language]);

  useEffect(() => {
    if (typeof Storage !== 'undefined') {
      //fetching currencycode from browser's localstorage
      if (localStorage.getItem('currencyCode')) {
        const currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      //fetching country code from browser's localstorage
      if (localStorage.getItem('countryCode')) {
        const countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
    }
  }, []);

  return (
    <>
      <div className={styles.navlink}>
        <GlobeIcon />
        <button
          className={styles.navlinkTitle}
          onClick={() => {
            setOpenModal(true); // open language and country change modal
          }}
        >
          {`${locale ? locale.toUpperCase() : ''} • ${selectedCurrency}`}
        </button>
      </div>
      <SelectLanguageAndCountry
        openModal={openModal}
        handleModalClose={() => setOpenModal(false)}
        setSelectedCurrency={setSelectedCurrency}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  );
}
interface NavLinkProps {
  link: NavLinkType;
  setactiveLink: Dispatch<SetStateAction<string>>;
  activeLink: string;
  activeSubMenu: string;
  setActiveSubMenu: Dispatch<SetStateAction<string>>;
  user: User;
  key: number;
  closeMenu: () => void;
}
function NavLink({
  link,
  setactiveLink,
  activeLink,
  activeSubMenu,
  setActiveSubMenu,
  user,
}: NavLinkProps) {
  const [isSubMenuActive, setisSubMenuActive] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    // Check if array of submenu has activeSubLink
    if (link.subMenu && link.subMenu.length > 0) {
      const subMenuItem = link.subMenu.find((subMenuItem) => {
        return subMenuItem.path === activeSubMenu;
      });
      if (subMenuItem) {
        link.path && setactiveLink(link.path);
        setActiveSubMenu(subMenuItem.path);
        if (activeSubMenu && subMenuItem.path === activeSubMenu) {
          setisSubMenuActive(true);
        }
      }
    }
  }, [activeLink]);

  if (link.accessLevel) {
    //checks the type of user login
    if (!link.accessLevel.includes(user.type)) {
      return null;
    }
  }

  return (
    <div key={link.title} className={styles.navlinkMenu}>
      <div
        className={`${styles.navlink} ${
          activeLink && activeLink === link.path ? styles.navlinkActive : ''
        } ${isSubMenuActive ? styles.navlinkActive : ''}`}
        onClick={() => {
          // This is to shift to the main page needed when there is no sub menu
          if ((!link.subMenu || link.subMenu.length <= 0) && link.path) {
            router.push(`/${locale}${link.path}`);
            setactiveLink(link.path);
            setActiveSubMenu('');
          } else {
            if (link.hideSubMenu && link.path) {
              router.push(`/${locale}${link.path}`);
            } else {
              setisSubMenuActive(!isSubMenuActive);
            }
          }
        }}
      >
        {link.icon}
        <button className={styles.navlinkTitle}>
          {link.title}
          {link.flag && <span>{link.flag}</span>}
        </button>
        {link.subMenu && link.subMenu.length > 0 && !link.hideSubMenu && (
          <button
            className={styles.subMenuArrow}
            style={{
              transform: isSubMenuActive ? 'rotate(-180deg)' : 'rotate(-90deg)',
            }}
          >
            <DownArrow />
          </button>
        )}
      </div>
      {isSubMenuActive &&
        link.subMenu &&
        link.subMenu.length > 0 &&
        !link.hideSubMenu &&
        link.subMenu.map((subLink, index) => {
          if (!subLink.hideItem) {
            return (
              <div
                className={`${styles.navlinkSubMenu} ${
                  activeSubMenu === subLink.path
                    ? styles.navlinkActiveSubMenu
                    : ''
                }`}
                key={index}
                onClick={() => {
                  //this is to shift to the submenu pages
                  link.path && setactiveLink(link.path);
                  setActiveSubMenu(subLink.path);
                  router.push(`/${locale}${subLink.path}`);
                }}
              >
                {subLink.title}
                {subLink.flag && <span>{subLink.flag}</span>}
              </div>
            );
          }
        })}
    </div>
  );
}

const UserLayout: FC = ({ children }) => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const router = useRouter();
  const { user, logoutUser, contextLoaded, isImpersonationModeOn } =
    useUserProps();

  // Flags can be added to show labels on the right
  // TO DO - remove arrow when link is selected
  const navLinks: NavLinkType[] = [
    {
      key: 1,
      title: t('profile'),
      path: '/profile',
      icon: <UserIcon />,
      // Localize with translations if you ever activate this!!
      // subMenu: [
      //   // {
      //   //   title: 'Profile',
      //   //   path: '/profile',
      //   // },
      //   {
      //     title: 'My Forest',
      //     path: '/profile/forest',
      //   },
      //   {
      //     title: 'Register Trees',
      //     path: '/profile/register-trees',
      //   },
      // ],
    },
    {
      key: 2,
      title: t('registerTrees'),
      path: '/profile/register-trees',
      icon: <RegisterTreeIcon />,
    },
    {
      key: 3,
      title: t('payments'),
      // path: '/profile/history',
      icon: <DonateIcon />,
      flag: t('new'),
      // hideSubMenu: true,
      subMenu: [
        {
          title: t('history'),
          path: '/profile/history',
          // hideItem: true,
        },
        {
          title: t('recurrency'),
          path: '/profile/recurrency',
          // hideItem: true,
        },
        {
          title: t('donationReceipts'),
          path: '/profile/donation-receipt',
          // hideItem: true,
        },
        {
          title: t('managePayouts.menuText'),
          path: '/profile/payouts',
          hideItem: !(user?.type === 'tpo'),
        },
        // Localize with translations if you ever activate this!!
        // {
        //   title: 'Payment Methods',
        //   path: '/profile/payment-methods',
        // },
      ],
    },
    // Localize with translations if you ever activate this!!
    // {
    //   title: 'TreeCash',
    //   path: '/profile/treecash',
    //   icon: TreeCashIcon,
    //   // subMenu: [
    //   //   {
    //   //     title: 'Profile & History',
    //   //     path: '/profile/history',
    //   //   },
    //   //   {
    //   //     title: 'Create Bulk Gifts',
    //   //     path: '/profile/recurring-donations',
    //   //   },
    //   // ],
    // },
    {
      key: 4,
      title: t('treemapper'),
      // path: '/profile/treemapper',
      icon: <TreeMappperIcon />,
      flag: t('beta'),
      subMenu: [
        {
          title: t('plantLocations'),
          path: '/profile/treemapper',
          // hideItem: true,
        },
        {
          title: t('mySpecies'),
          path: '/profile/treemapper/my-species',
          hideItem: !(user?.type === 'tpo'),
        },
        {
          title: t('import'),
          path: '/profile/treemapper/import',
          hideItem: !(user?.type === 'tpo'),
        },
        {
          title: t('dataExplorer'),
          path: '/profile/treemapper/data-explorer',
          hideItem: !(process.env.ENABLE_ANALYTICS && user?.type === 'tpo'),
        },
      ],
    },
    {
      key: 5,
      title: t('projects'),
      path: '/profile/projects',
      icon: <MapIcon />,
      accessLevel: ['tpo'],
    },
    {
      key: 6,
      title: t('planetCash.menuText'),
      icon: <PlanetCashIcon />,
      flag: t('new'),
      subMenu: [
        {
          title: t('planetCash.submenuText'),
          path: '/profile/planetcash',
        },
        {
          title: t('bulkCodes'),
          path: '/profile/bulk-codes',
          flag: t('beta'),
        },
        {
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
    /* {
      key: 6,
      title: t('bulkCodes'),
      path: '/profile/bulk-codes',
      icon: <GiftIcon />,
      hasRelatedLinks: true,
    }, */
    {
      key: 7,
      title: t('widgets'),
      icon: <WidgetIcon />,
      subMenu: [
        {
          title: t('embedWidget'),
          path: '/profile/widgets',
          // hideItem: true,
        },
        {
          title: t('donationLink'),
          path: '/profile/donation-link',
          flag: t('new'),
          // hideItem: true,
        },
      ],
    },
    {
      key: 8,
      title: t('settings'),
      icon: <SettingsIcon />,
      subMenu: [
        {
          title: t('editProfile'),
          path: '/profile/edit',
        },
        {
          title: t('switchUser'),
          path: '/profile/impersonate-user',
          hideItem: isImpersonationModeOn || !user?.allowedToSwitch,
        },
        {
          title: t('apiKey'),
          path: '/profile/api-key',
        },
        {
          title: t('deleteProfile'),
          path: '/profile/delete-account',
        },
        // Localize with translations if you ever activate this!!
        // {
        //   title: 'Setup 2Factor Authentication',
        //   path: '/profile/2fa', // Only for Tpos
        // },
      ],
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setactiveLink] = useState('/profile');
  const [activeSubMenu, setActiveSubMenu] = useState('');

  useEffect(() => {
    if (router) {
      for (const link of navLinks) {
        //checks whether the path belongs to menu or Submenu
        if (link.path && router.asPath === `/${locale}${link.path}`) {
          setactiveLink(link.path);
        } else if (link.subMenu && link.subMenu.length > 0) {
          const subMenuItem = link.subMenu.find(
            (subMenuItem: SubMenuItemType) => {
              return subMenuItem.path === router.asPath;
            }
          );
          if (subMenuItem) {
            link.path && setactiveLink(link.path);
            setActiveSubMenu(subMenuItem.path);
          }
        } else if (
          link.hasRelatedLinks &&
          link.path &&
          router.asPath.includes(link.path)
        ) {
          setactiveLink(link.path);
        }
      }
    }
  }, [router]);

  useEffect(() => {
    if (contextLoaded) {
      //Redirects the user to the desired page after login
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
        onClick={() => setIsMenuOpen(true)} // for mobile verion to open menu
        style={{ marginTop: isImpersonationModeOn ? '47px' : '' }}
      >
        <MenuIcon />
      </div>
      <div
        className={`${
          isImpersonationModeOn
            ? `${styles.sidebarModified}`
            : `${styles.sidebar}`
        } ${!isMenuOpen ? styles.menuClosed : ''}`}
      >
        <div className={styles.navLinksContainer}>
          <>
            <div key={'closeMenu'} className={`${styles.closeMenu}`}>
              <div
                className={`${styles.navlink}`}
                onClick={() => setIsMenuOpen(false)} //for mobile version to close menu
              >
                <BackArrow />
                <button className={styles.navlinkTitle}>{t('close')}</button>
              </div>
            </div>
            {navLinks.map((link: NavLinkType, index: number) => (
              <NavLink
                link={link}
                setactiveLink={setactiveLink}
                activeLink={activeLink}
                activeSubMenu={activeSubMenu}
                setActiveSubMenu={setActiveSubMenu}
                user={user}
                key={index}
                closeMenu={() => setIsMenuOpen(false)}
              />
            ))}
          </>
        </div>

        <div>
          <LanguageSwitcher />

          {!isImpersonationModeOn && (
            <div className={styles.navlink}>
              <FiberPinIcon />
              <SupportPin />
            </div>
          )}
          <div className={styles.navlink}>
            <NotionLinkIcon />
            <button
              onClick={() =>
                window.open(
                  'https://plantfortheplanet.notion.site/Public-Documentation-Plant-for-the-Planet-Platform-04af8ed821b44d358130142778d79e01',
                  '_blank'
                )
              }
              className={styles.navlinkTitle}
            >
              {t('document')}
            </button>
          </div>
          <div
            className={styles.navlink}
            //logout user
            onClick={() => {
              localStorage.removeItem('impersonationData');
              logoutUser(`${window.location.origin}/`);
            }}
          >
            <LogoutIcon />
            <button className={styles.navlinkTitle}>{t('logout')}</button>
            <button className={styles.subMenuArrow}></button>
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
