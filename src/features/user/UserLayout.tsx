import React, { ReactElement } from 'react';
import styles from './Profile/styles/Profile.module.scss';
import Profile from './Profile';
import Link from 'next/link';
import DownArrow from '../../../public/assets/images/icons/DownArrow';
import router from 'next/router';

const TreeCounterIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const PaymentMethodsIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const DonationsIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const TreeCashIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const TreeMapperIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const ProjectsIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const CreateWidgetIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const SettingsIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);
const LogoutIcon = (
  <img src="/assets/images/icons/Widget.svg" alt="Widget Icon" />
);

function UserLayout(props: any): ReactElement {
  const navLinks = [
    {
      title: 'TreeCounter',
      path: '/profile',
      icon: TreeCounterIcon,
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
      path: '/donations',
      icon: DonationsIcon,
      subMenu: [
        {
          title: 'History',
          path: '/profile/history',
        },
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
      icon: TreeMapperIcon,
    },
    {
      title: 'Projects',
      path: '/profile/projects',
      icon: ProjectsIcon,
    },
    {
      title: 'Create Widget',
      path: '/profile/widgets',
      icon: CreateWidgetIcon,
    },
    {
      title: 'Settings',
      path: '/profile/settings',
      icon: SettingsIcon,
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

        <div className={styles.navlink}>
          {LogoutIcon}
          <button className={styles.navlinkTitle}>{'Logout'}</button>
        </div>
      </div>
      <div className={styles.profilePage}>{props.children}</div>
    </div>
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
          if (!link.subMenu) {
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
