import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import Donate from '../../../assets/images/navigation/Donate';
import Leaderboard from '../../../assets/images/navigation/Leaderboard';
import Me from '../../../assets/images/navigation/Me';
import LOGO from '../../../assets/images/PlanetLogo';
import styles from './Navbar.module.scss';

export default function NavbarComponent(props: any) {
  const router = useRouter();
  const session = useSession()[0];

  let menuItems = [
    {
      id: 1,
      name: 'About us',
      path: '/about',
      icon: (
        <LOGO color={router.pathname === '/about' ? '#89b35a' : '#2f3336'} />
      ),
    },
    {
      id: 2,
      name: 'Donate/Gift',
      path: '/',
      icon: <Donate color={router.pathname === `/` ? '#89b35a' : '#2f3336'} />,
    },
    {
      id: 3,
      name: 'Leaderboard',
      path: '/leaderboard',
      icon: (
        <Leaderboard
          color={router.pathname === '/leaderboard' ? '#89b35a' : '#2f3336'}
        />
      ),
    },
    {
      id: 4,
      name: 'Me',
      path: '/me',
      icon: (
        <Me
          src={session?.user?.image}
          color={router.pathname === '/me' ? '#89b35a' : '#2f3336'}
        />
      ),
    },
  ];
  return (
    <>
      <Navbar
        fixed="top"
        className={styles.top_nav}
        bg={props.theme === 'theme-light' ? 'light' : 'dark'}
        variant={props.theme === 'theme-light' ? 'light' : 'dark'}
      >
        <Nav className={'d-none d-md-flex flex-row ' + styles.nav_container}>
          {menuItems.map((item) => {
            return (
              <Nav.Link key={item.id}>
                <Link href={item.path}>
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>{item.icon}</div>
                    <p>{item.name}</p>
                  </div>
                </Link>
              </Nav.Link>
            );
          })}
        </Nav>
      </Navbar>

      <Navbar fixed="bottom" className="d-md-none" bg="light" expand="lg">
        <Nav className={'d-flex flex-row ' + styles.mobile_nav}>
          {menuItems.map((item) => {
            return (
              <Nav.Link key={item.id}>
                <Link href={item.path}>
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>{item.icon}</div>
                    <p>{item.name}</p>
                  </div>
                </Link>
              </Nav.Link>
            );
          })}
        </Nav>
      </Navbar>
    </>
  );
}
