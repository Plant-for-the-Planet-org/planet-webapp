import React, { ReactElement } from 'react';
import styles from './Profile/styles/Profile.module.scss';
import DownArrow from '../../../public/assets/images/icons/DownArrow';
import router from 'next/router';
import i18next from '../../../i18n';
import SelectLanguageAndCountry from '../common/Layout/Footer/SelectLanguageAndCountry';
import WidgetIcon from '../../../public/assets/images/icons/Sidebar/Widget';
import LogoutIcon from '../../../public/assets/images/icons/Sidebar/LogoutIcon';
import SettingsIcon from '../../../public/assets/images/icons/Sidebar/SettingsIcon';
import GlobeIcon from '../../../public/assets/images/icons/Sidebar/Globe';
import UserIcon from '../../../public/assets/images/icons/Sidebar/UserIcon';
import MapIcon from '../../../public/assets/images/icons/Sidebar/MapIcon';
import DonateIcon from '../../../public/assets/images/icons/Sidebar/DonateIcon';

const { useTranslation } = i18next;

function UserLayout(props: any): ReactElement {
  const navLinks = [
    {
      title: 'TreeCounter',
      path: '/profile',
      icon: <UserIcon />,
      flag: 'New',
      subMenu: [
        {
          title: 'Profile',
          path: '/profile',
        },
        {
          title: 'My Forest',
          path: '/profile/forest',
        },
        {
          title: 'Register Trees',
          path: '/profile/register-trees',
        },
      ],
    },
    {
      title: 'Donations',
      path: '/profile/history',
      icon: <DonateIcon />,
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
      title: 'TreeMapper',
      path: '/profile/treemapper',
      icon: <WidgetIcon />,
    },
    {
      title: 'Projects',
      path: '/profile/projects',
      icon: <MapIcon />,
    },
    {
      title: 'Create Widget',
      path: '/profile/widgets',
      icon: <WidgetIcon />,
    },
    {
      title: 'Settings',
      path: '/profile/settings',
      icon: <SettingsIcon />,
      subMenu: [
        {
          title: 'Edit Profile',
          path: '/profile/edit',
        },
        {
          title: 'Delete Profile',
          path: '/profile/delete-account',
        },
        // {
        //   title: 'Setup 2Factor Authentication',
        //   path: '/profile/2fa', // Only for Tpos
        // },
      ],
    },
  ];

  const [open, setOpen] = React.useState(true);
  const [activeLink, setactiveLink] = React.useState('/profile');

  React.useEffect(() => {
    if (router) {
      setactiveLink(router.router?.asPath);
    }
  }, [router]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={styles.profilePageContainer}
      style={{
        paddingLeft: open ? '256px' : '0px',
      }}
    >
      <div className={styles.sidebar}>
        <div className={styles.navLinksContainer}>
          {navLinks.map((link: any) => (
            <NavLink
              link={link}
              setactiveLink={setactiveLink}
              activeLink={activeLink}
            />
          ))}
        </div>

        <div>
          <LanguageSwitcher />

          <div className={styles.navlink}>
            <LogoutIcon />
            <button className={styles.navlinkTitle}>{'Logout'}</button>
            <button className={styles.subMenuArrow}></button>
          </div>
        </div>
      </div>
      <div className={styles.profilePage}>{props.children}</div>
    </div>
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

function NavLink({ link, setactiveLink, activeLink }: any) {
  const [subMenuOpen, setsubMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Check if array of submenu has activeSubLink
    if (link.subMenu && link.subMenu.length > 0) {
      const subMenuItem = link.subMenu.find((subMenuItem: any) => {
        return subMenuItem.path === activeLink;
      });
      if (subMenuItem) {
        setactiveLink(subMenuItem.path);
        setsubMenuOpen(true);
      }
    }
  }, [activeLink]);
  return (
    <div key={link.title} className={styles.navlinkMenu}>
      <div
        className={`${styles.navlink} ${
          activeLink === link.path ? styles.navlinkActive : ''
        }`}
        onClick={() => {
          setsubMenuOpen(!subMenuOpen);
          if (!link.subMenu || link.subMenu.length <= 0) {
            setactiveLink(link.path);
            router.push(link.path);
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
              transform: subMenuOpen ? 'rotate(-180deg)' : 'rotate(-90deg)',
            }}
          >
            <DownArrow />
          </button>
        )}
      </div>
      {subMenuOpen &&
        link.subMenu &&
        link.subMenu.length > 0 &&
        link.subMenu.map((subLink: any) => (
          <div
            className={`${styles.navlinkSubMenu} ${
              activeLink === subLink.path ? styles.navlinkActive : ''
            }`}
            onClick={() => {
              setactiveLink(subLink.path);
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
