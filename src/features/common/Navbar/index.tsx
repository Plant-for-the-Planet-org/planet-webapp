import React from 'react'
import {Navbar,Nav} from 'react-bootstrap'
import LOGO from '../../../assets/images/PlanetLogo'
import Gift from '../../../assets/images/navigation/Gift'
import Compete from '../../../assets/images/navigation/Compete'
import Globe from '../../../assets/images/navigation/Globe'
import Map from '../../../assets/images/navigation/Map'
import Donate from '../../../assets/images/navigation/Donate'
import Me from '../../../assets/images/navigation/Me'

import { useRouter } from 'next/router'
import { useSession, getSession, signin, signout } from 'next-auth/client'

import Link from 'next/link'
import styles from './Navbar.module.css'
export default function NavbarComponent(props:any) {
    const router = useRouter()
    const session = useSession()[0]
    console.log(session)

    let menuItems = [
        {id:1,name:'World',path:'/',icon:<Globe color={router.pathname === '/' ?'#89b35a' :'#2f3336'} />},
        {id:2,name:'Gift Trees',path:'/gift',icon:<Gift color={router.pathname === '/gift' ?'#89b35a' :'#2f3336'}/>},
        {id:3,name:'Donate',path:'/donate',icon:<Donate color={router.pathname === '/donate' ?'#89b35a' :'#2f3336'} />},
        {id:4,name:'Compete',path:'/compete',icon:<Compete color={router.pathname === '/compete' ?'#89b35a' :'#2f3336'}/>},
        {id:5,name:'Map',path:'/map',icon:<Map color={router.pathname === '/map' ?'#89b35a' :'#2f3336'} />},
    ]
    return (
        <>
        <Navbar className={styles.top_nav} bg={props.theme === 'theme-light' ? 'light' : 'dark' } variant={props.theme === 'theme-light' ? 'light' : 'dark' }>
            <Navbar.Brand href="/">
               <div style={{width:50,height:43}}>
                    <LOGO/>
               </div>   
            </Navbar.Brand>

                <Nav className={"d-none d-md-flex flex-row "+styles.nav_container}>
                    {menuItems.map(item=>{
                        return(
                        <Nav.Link key={item.id}>
                            <Link href={item.path} >
                                <div className={styles.link_container}>
                                    <div className={styles.link_icon}>
                                        {item.icon}
                                    </div>
                                    <p>{item.name}</p>
                                </div>
                            </Link>
                        </Nav.Link>
                        )
                    })}
                </Nav>
                <Nav className={styles.nav_container}>
                    <Nav.Link>
                        <Link href={'/me'} >
                            <div className={styles.link_container}>
                                <div className={styles.link_icon}>
                                    <Me src={session ? session.user.image : session}/>
                                </div>
                                <p>Me</p>
                            </div>
                        </Link>
                    </Nav.Link>
                </Nav>
        </Navbar>

        <Navbar fixed="bottom" className="d-md-none" bg="light" expand="lg">
                <Nav className={"d-flex flex-row "+styles.mobile_nav}>
                    {menuItems.map(item=>{
                        return(
                        <Nav.Link key={item.id}>
                            <Link href={item.path} >
                                <div className={styles.link_container}>
                                    <div className={styles.link_icon}>
                                        {item.icon}
                                    </div>
                                    <p>{item.name}</p>
                                </div>
                            </Link>
                        </Nav.Link>
                        )
                    })}
                </Nav>
        </Navbar>
        </>
    )
}
