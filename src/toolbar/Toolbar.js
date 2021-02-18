import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './toolbar.scss';

import closeWhite from './img/close-white.svg';
import closeBlack from './img/close-black.svg';
import menuWhite from './img/menu-white.svg';
import menuBlack from './img/menu-black.svg';

function Toolbar(props) {
    const [scrolled, setScrolled] = useState(false);
    const [menuToggle, setMenuToggle] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(menuWhite);
    const [navHide, setNavHide ] = useState(true);
    let prevScrollpos = window.pageYOffset;
    


    window.addEventListener('load', () => {
        const section = document.querySelector('#sections');
        section.addEventListener('scroll', sectionScroll)
    })

    const sectionScroll = () => {

        
        const windowScroll = () => {
            const hero = document.querySelector('#hero')
            let currentScrollPos = hero.getBoundingClientRect().y *-1;
            if(currentScrollPos * -1 === -0) {
                setScrolled(false)
                if(mobileMenu === menuBlack || mobileMenu === closeBlack) {
                    if(mobileMenu === menuBlack) {
                        setMobileMenu(menuWhite)
                    } else {
                        setMobileMenu(closeWhite)
                    }
                } else {
                    if(mobileMenu === menuWhite) {
                        setMobileMenu(menuWhite)
                    } else {
                        setMobileMenu(closeWhite)
                    }
                }
            } 
            else {
                setScrolled(true)
                if(mobileMenu === menuWhite || mobileMenu === closeWhite) {
                    if(mobileMenu === menuWhite) {
                        setMobileMenu(menuBlack)
                    } else setMobileMenu(closeBlack)
                }
            }
        }
        
        const scrollNavHide = () => {
            const hero = document.querySelector('#hero')
            let currentScrollPos = hero.getBoundingClientRect().y *-1;
            if(currentScrollPos * -1 === -0 ) {
                setNavHide(true)
            }
            else if (prevScrollpos > currentScrollPos) {
                setNavHide(true)
            } else  {
                setNavHide(false)
            }
            prevScrollpos = currentScrollPos;
        }
        windowScroll()
        scrollNavHide()
    }   



    const mobileMenuToggle = () => {
        setMenuToggle(true)
        if(mobileMenu === menuWhite || mobileMenu === menuBlack) {
            if(mobileMenu === menuWhite) {
                setTimeout(() => {
                    setMenuToggle(false)
                    setMobileMenu(closeWhite) 
                }, 200)
            } else {
                setTimeout(() => {
                    setMenuToggle(false)
                    setMobileMenu(closeBlack) 
                }, 200)
            }
        }
        else if(mobileMenu === closeWhite || mobileMenu === closeBlack) {
            if(mobileMenu === closeWhite) {
                setTimeout(() => {
                    setMenuToggle(false)
                    setMobileMenu(menuWhite) 
                }, 200)
            } else {
                setTimeout(() => {
                    setMenuToggle(false)
                    setMobileMenu(menuBlack) 
                }, 200)
            }
        }
    }


    const handleClick = (link) => {
        const anchor = document.querySelector(link)
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return (
    <div 
        className={`${scrolled ? 'navBar scrollBar' : 'navBar'} ${navHide ? '' : 'scrolled'}`} 
        id="mainNav">
			<div className='navBarContainer'>
				<p id="main-title"><Link to="/">BS</Link></p>
                <div>
                    <ul id="mainMenuList">
                        <li><a className="navList" onClick={() => handleClick('#about')}>About</a></li>
                        <li><a className="navList" onClick={() => handleClick('#portfolio')}>Portfolio</a></li>
                        {/*<li><a className="navList" onClick={() => handleClick('#components')}>Components</a></li>*/}
                        <li><a className="navList" onClick={() => handleClick('#contact')}>Contact</a></li>
                    </ul>
                </div>
                
                {/*<img
                    onClick={() => mobileMenuToggle()}
                    className={menuToggle ? 'menu-icon' : 'menu-icon-animation'} 
                    src={mobileMenu}
                alt="menu toggle"/>*/}
			</div>
		</div>
    )
} 
export default Toolbar;
