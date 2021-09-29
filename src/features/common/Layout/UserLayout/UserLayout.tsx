import router from 'next/router';
import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import MenuIcon from '../../../../../public/assets/images/icons/Sidebar/MenuIcon';
import DownArrow from '../../../../../public/assets/images/icons/DownArrow';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import DonateIcon from '../../../../../public/assets/images/icons/Sidebar/DonateIcon';
import GlobeIcon from '../../../../../public/assets/images/icons/Sidebar/Globe';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import MapIcon from '../../../../../public/assets/images/icons/Sidebar/MapIcon';
import SettingsIcon from '../../../../../public/assets/images/icons/Sidebar/SettingsIcon';
import UserIcon from '../../../../../public/assets/images/icons/Sidebar/UserIcon';
import WidgetIcon from '../../../../../public/assets/images/icons/Sidebar/Widget';
import UserProfileLoader from '../../ContentLoaders/UserProfile/UserProfile';
import SelectLanguageAndCountry from '../Footer/SelectLanguageAndCountry';
import { UserPropsContext } from '../UserPropsContext';
import styles from './UserLayout.module.scss';
import TreeMappperIcon from '../../../../../public/assets/images/icons/Sidebar/TreeMapperIcon';
import RegisterTreeIcon from '../../../../../public/assets/images/icons/Sidebar/RegisterIcon';

const { useTranslation } = i18next;

function UserLayout(props: any): ReactElement {
  const { t, i18n } = useTranslation(['common','me']);
  // Flags can be added to show labels on the right
  // TO DO - remove arrow when link is selected
  const navLinks = [
    {
      key: 1,
      title: t('me:profile'),
      path: '/profile',
      icon: <UserIcon />,

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
      path: '/profile/history',
      icon: <DonateIcon />,
      flag: 'Beta',
      subMenu: [
        // {
        //   title: 'History',
        //   path: '/profile/history',
        // },
        // {
        //   title: 'Recurring Donations',
        //   path: '/profile/recurring-donations',
        // },
        // {
        //   title: 'Payouts',
        //   path: '/profile/payouts', // Only for Tpos
        // },
        // {
        //   title: 'Payment Methods',
        //   path: '/profile/payment-methods',
        // },
      ],
    },
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
      path: '/profile/treemapper',
      icon: <TreeMappperIcon />,
      flag: 'Beta',
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
      title: t('me:embedWidget'),
      path: '/profile/widgets',
      icon: <WidgetIcon />,
    },
    {
      key: 7,
      title: t('me:settings'),
      icon: <SettingsIcon />,
      subMenu: [
        {
          title: t('me:editProfile'),
          path: '/profile/edit',
        },
        {
          title: t('me:deleteProfile'),
          path: '/profile/delete-account',
        },
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
        }
      }
    }
  }, [router]);

  const { user, logoutUser, contextLoaded } = React.useContext(
    UserPropsContext
  );

  React.useEffect(() => {
    if (contextLoaded) {
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
        onClick={() => setIsMenuOpen(true)}
      >
        <MenuIcon />
      </div>
      <div
        className={`${styles.sidebar} ${!isMenuOpen ? styles.menuClosed : ''}`}
      >
        <div className={styles.navLinksContainer}>
          <>
            <div key={'closeMenu'} className={`${styles.closeMenu}`}>
              <div
                className={`${styles.navlink}`}
                onClick={() => setIsMenuOpen(false)}
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
          <div
            className={styles.navlink}
            onClick={() => logoutUser(`${process.env.NEXTAUTH_URL}/`)}
          >
            <LogoutIcon />
            <button className={styles.navlinkTitle}>{t('logout')}</button>
            <button className={styles.subMenuArrow}></button>
          </div>
        </div>
      </div>
      <div className={styles.profilePageWrapper}>{props.children}</div>
    </div>
  ) : (
    <UserProfileLoader />
  );
}

function LanguageSwitcher() {
  const { t, i18n, ready } = useTranslation(['common']);

  const [language, setLanguage] = React.useState(i18n.language);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
  const [selectedCountry, setSelectedCountry] = React.useState('DE');

  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('language')) {
        const langCode = localStorage.getItem('language') || 'en';
        if (langCode) setLanguage(langCode.toLowerCase());
      }
    }
  }, [language]);

  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        const currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      if (localStorage.getItem('countryCode')) {
        const countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
    }
  }, []);

  return ready ? (
    <>
      <div
        className={styles.navlink}
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <GlobeIcon />
        <button className={styles.navlinkTitle}>
          {`${language ? language.toUpperCase() : ''} • ${selectedCurrency}`}
        </button>
        <button></button>
      </div>
      <SelectLanguageAndCountry
        openModal={openModal}
        handleModalClose={() => setOpenModal(false)}
        language={language}
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
  closeMenu,
}: any) {
  React.useEffect(() => {
    // Check if array of submenu has activeSubLink
    if (link.subMenu && link.subMenu.length > 0) {
      const subMenuItem = link.subMenu.find((subMenuItem: any) => {
        return subMenuItem.path === activeLink;
      });
      if (subMenuItem) {
        setactiveLink(link.path);
        setActiveSubMenu(subMenuItem.path);
      }
    }
  }, [activeLink]);

  if (link.accessLevel) {
    if (!link.accessLevel.includes(user.type)) {
      return null;
    }
  }

  const [isSubMenuActive, setisSubMenuActive] = React.useState(false);

  return (
    <div key={link.title} className={styles.navlinkMenu}>
      <div
        className={`${styles.navlink} ${
          activeLink === link.path ? styles.navlinkActive : ''
        }`}
        onClick={() => {
          // This is to shift to the main page needed when there is no sub menu
          if ((!link.subMenu || link.subMenu.length <= 0) && link.path) {
            router.push(link.path);
            setactiveLink(link.path);
            setActiveSubMenu('');
          } else {
            setisSubMenuActive(!isSubMenuActive);
          }
        }}
      >
        {link.icon}
        <button className={styles.navlinkTitle}>
          {link.title}
          {link.flag && <span>{link.flag}</span>}
        </button>
        {link.subMenu && link.subMenu.length > 0 && (
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
        link.subMenu.map((subLink: any, index: any) => (
          <div
            className={`${styles.navlinkSubMenu} ${
              activeSubMenu === subLink.path ? styles.navlinkActiveSubMenu : ''
            }`}
            key={index}
            onClick={() => {
              setactiveLink(link.path);
              setActiveSubMenu(subLink.path);
              router.push(subLink.path);
            }}
          >
            {subLink.title}
          </div>
        ))}
    </div>
  );
}

export default UserLayout;
