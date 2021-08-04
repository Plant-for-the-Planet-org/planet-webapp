import React, { ReactElement } from 'react';
import styles from './Profile/styles/Profile.module.scss';
import Profile from './Profile';
import Link from 'next/link';
import DownArrow from '../../../public/assets/images/icons/DownArrow';

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
          path: '/profile/',
        },
        {
          title: 'Set Target',
          path: '/profile/set-target',
        },
        {
          title: 'Register Trees',
          path: '/profile/register-trees',
        },
      ],
    },
    {
      title: 'Payment Methods',
      path: '/payment-methods',
      icon: PaymentMethodsIcon,
    },
    {
      title: 'Donations',
      path: '/donations',
      icon: DonationsIcon,
    },
    {
      title: 'TreeCash',
      path: '/treecash',
      icon: TreeCashIcon,
    },
    {
      title: 'TreeMapper',
      path: '/treemapper',
      icon: TreeMapperIcon,
    },
    {
      title: 'Projects',
      path: '/projects',
      icon: ProjectsIcon,
    },
    {
      title: 'Create Widget',
      path: '/create-widget',
      icon: CreateWidgetIcon,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: SettingsIcon,
    },
  ];

  const [open, setOpen] = React.useState(true);
  const [activeLink, setactiveLink] = React.useState('/profile');
  const [activeSubLink, setactiveSubLink] = React.useState('/profile/');

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
              activeSubLink={activeSubLink} 
              setactiveSubLink={setactiveSubLink}
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

function NavLink({ link, setactiveLink, activeLink,setactiveSubLink, activeSubLink }: any) {
  const [subMenuOpen, setsubMenuOpen] = React.useState(false);
  return (
    <div key={link.title} className={styles.navlinkMenu}>
      <div
        className={`${styles.navlink} ${
          activeLink === link.path ? styles.navlinkActive : ''
        }`}
        onClick={() => {
          setsubMenuOpen(!subMenuOpen);
          setactiveLink(link.path);
          
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
            activeSubLink === subLink.path ? styles.navlinkActive : ''
          }`}
          onClick={() => {
            setactiveSubLink(subLink.path);
          }}>{subLink.title}</div>
        ))}
    </div>
  );
}

export default UserLayout;
