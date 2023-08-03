import router, { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
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
import UserProfileLoader from '../../ContentLoaders/UserProfile/UserProfile';
import SelectLanguageAndCountry from '../Footer/SelectLanguageAndCountry';
import { useUserProps } from '../UserPropsContext';
import styles from './UserLayout.module.scss';
import TreeMappperIcon from '../../../../../public/assets/images/icons/Sidebar/TreeMapperIcon';
import RegisterTreeIcon from '../../../../../public/assets/images/icons/Sidebar/RegisterIcon';
import NotionLinkIcon from '../../../../../public/assets/images/icons/Sidebar/NotionLinkIcon';
import SupportPin from '../../../user/Settings/ImpersonateUser/SupportPin';
import FiberPinIcon from '@mui/icons-material/FiberPin';

function LanguageSwitcher() {
  const { i18n, ready } = useTranslation(['common', 'me']);

  const [language, setLanguage] = React.useState(i18n.language);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
  const [selectedCountry, setSelectedCountry] = React.useState('DE');

  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      //fetching language from browser's local storage
      if (localStorage.getItem('language')) {
        const langCode = localStorage.getItem('language') || 'en';
        if (langCode) setLanguage(langCode.toLowerCase());
      }
    }
  }, [language]);

  React.useEffect(() => {
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

  return ready ? (
    <>
      <div className={styles.navlink}>
        <GlobeIcon />
        <button
          className={styles.navlinkTitle}
          onClick={() => {
            setOpenModal(true); // open language and country change modal
          }}
        >
          {`${
            i18n.language ? i18n.language.toUpperCase() : ''
          } • ${selectedCurrency}`}
        </button>
      </div>
      <SelectLanguageAndCountry
        openModal={openModal}
        handleModalClose={() => setOpenModal(false)}
        language={i18n.language}
        setLanguage={setLanguage}
        setSelectedCurrency={setSelectedCurrency}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  ) : (
    <></>
  );
}

function NavLink({
  link,
  setactiveLink,
  activeLink,
  activeSubMenu,
  setActiveSubMenu,
  user,
}: any) {
  const [isSubMenuActive, setisSubMenuActive] = React.useState(false);
  React.useEffect(() => {
    // Check if array of submenu has activeSubLink
    if (link.subMenu && link.subMenu.length > 0) {
      const subMenuItem = link.subMenu.find((subMenuItem: any) => {
        return subMenuItem.path === activeSubMenu;
      });
      if (subMenuItem) {
        setactiveLink(link.path);
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
            router.push(link.path);
            setactiveLink(link.path);
            setActiveSubMenu('');
          } else {
            if (link.hideSubMenu) {
              router.push(link.path);
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
        link.subMenu.map((subLink: any, index: any) => {
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
                  setactiveLink(link.path);
                  setActiveSubMenu(subLink.path);
                  router.push(subLink.path);
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

function UserLayout(props: any): ReactElement {
  const { t } = useTranslation(['common', 'me']);
  // const { asPath } = useRouter();
  const router = useRouter();
  const { user, logoutUser, contextLoaded, isImpersonationModeOn } =
    useUserProps();

  // Flags can be added to show labels on the right
  // TO DO - remove arrow when link is selected
  const navLinks = [
    {
      key: 1,
      title: t('me:profile'),
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
      title: t('me:registerTrees'),
      path: '/profile/register-trees',
      icon: <RegisterTreeIcon />,
    },
    {
      key: 3,
      title: t('me:payments'),
      // path: '/profile/history',
      icon: <DonateIcon />,
      flag: t('me:new'),
      // hideSubMenu: true,
      subMenu: [
        {
          title: t('me:history'),
          path: '/profile/history',
          // hideItem: true,
        },
        {
          title: t('me:recurrency'),
          path: '/profile/recurrency',
          // hideItem: true,
        },
        {
          title: t('me:managePayouts.menuText'),
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
      title: t('treeMapper'),
      // path: '/profile/treemapper',
      icon: <TreeMappperIcon />,
      flag: t('me:beta'),
      subMenu: [
        {
          title: t('me:plantLocations'),
          path: '/profile/treemapper',
          // hideItem: true,
        },
        {
          title: t('me:mySpecies'),
          path: '/profile/treemapper/my-species',
          hideItem: !(user?.type === 'tpo'),
        },
        {
          title: t('me:import'),
          path: '/profile/treemapper/import',
          hideItem: !(user?.type === 'tpo'),
        },
        {
          title: t('me:dataExplorer'),
          path: '/profile/treemapper/data-explorer',
          hideItem: !(process.env.ENABLE_ANALYTICS && user?.type === 'tpo'),
        },
      ],
    },
    {
      key: 5,
      title: t('me:projects'),
      path: '/profile/projects',
      icon: <MapIcon />,
      accessLevel: ['tpo'],
    },
    {
      key: 6,
      title: t('me:planetcash.menuText'),
      icon: <PlanetCashIcon />,
      flag: t('me:new'),
      subMenu: [
        {
          title: t('me:planetcash.submenuText'),
          path: '/profile/planetcash',
        },
        {
          title: t('me:bulkCodes'),
          path: '/profile/bulk-codes',
          flag: t('me:beta'),
        },
        {
          title: t('me:giftFund'),
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
      title: t('me:bulkCodes'),
      path: '/profile/bulk-codes',
      icon: <GiftIcon />,
      hasRelatedLinks: true,
    }, */
    {
      key: 7,
      title: t('me:widgets'),
      icon: <WidgetIcon />,
      subMenu: [
        {
          title: t('me:embedWidget'),
          path: '/profile/widgets',
          // hideItem: true,
        },
        {
          title: t('me:donationLink'),
          path: '/profile/donation-link',
          flag: t('me:new'),
          // hideItem: true,
        },
      ],
    },
    {
      key: 8,
      title: t('me:settings'),
      icon: <SettingsIcon />,
      subMenu: [
        {
          title: t('me:editProfile'),
          path: '/profile/edit',
        },
        {
          title: t('me:switchUser'),
          path: '/profile/impersonate-user',
          hideItem: isImpersonationModeOn || !user?.allowedToSwitch,
        },
        {
          title: t('me:apiKey'),
          path: '/profile/api-key',
        },
        {
          title: t('me:deleteProfile'),
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

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeLink, setactiveLink] = React.useState('/profile');
  const [activeSubMenu, setActiveSubMenu] = React.useState('');

  React.useEffect(() => {
    if (router) {
      for (const link of navLinks) {
        //checks whether the path belongs to menu or Submenu
        if (router.router?.asPath === link.path) {
          setactiveLink(link.path);
        } else if (link.subMenu && link.subMenu.length > 0) {
          const subMenuItem = link.subMenu.find((subMenuItem: any) => {
            return subMenuItem.path === router.router?.asPath;
          });
          if (subMenuItem) {
            setactiveLink(link.path);
            setActiveSubMenu(subMenuItem.path);
          }
        } else if (
          link.hasRelatedLinks &&
          router.router?.asPath.includes(link.path)
        ) {
          setactiveLink(link.path);
        }
      }
    }
  }, [router]);

  React.useEffect(() => {
    if (contextLoaded) {
      //checks whether user is login
      if (router.asPath) {
        if (router.query.slug) {
          router.push(`${router.pathname}`);
        } else {
          localStorage.setItem('redirectLink', router.asPath);
        }
      }
      if (!user) {
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
            {navLinks.map((link: any, index: any) => (
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
              logoutUser(`${process.env.NEXTAUTH_URL}/`);
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
        {props.children}
      </div>
    </div>
  ) : (
    <UserProfileLoader />
  );
}

export default UserLayout;
