import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './toolbar.scss';

import closeWhite from './img/close-white.svg';
import closeBlack from './img/close-black.svg';
import menuWhite from './img/menu-white.svg';
import menuBlack from './img/menu-black.svg';

function Toolbar(props) {
    const [scrolled, setScrolled] = useState(false);
    const [menuToggle, setMenuToggle] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(menuWhite)

    window.onscroll = () => {
        if(window.scrollY <= 10) {
            setScrolled(false)
            if(mobileMenu === menuBlack || mobileMenu === closeBlack) {
                if(mobileMenu === menuBlack) {
                    setMobileMenu(menuWhite)
                } else setMobileMenu(closeWhite)
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
    <div className={scrolled ? 'navBar scrollBar' : 'navBar'} id="mainNav">
			<div className='navBarContainer'>
				<div className='navBarTitle'>
					<p id="main-title"><Link to="/">BStagner</Link></p>
				</div>
                <div>
                    <ul id="mainMenuList">
                        <li><a className="navList" onClick={() => handleClick('#about')}>About</a></li>
                        
                    </ul>
                    <span id="indicator"></span>    
                </div>
                
                <img
                    onClick={() => mobileMenuToggle()}
                    className={menuToggle ? 'menu-icon' : 'menu-icon-animation'} 
                    src={mobileMenu}
                    alt="menu toggle"/>
			</div>
		</div>
    )
} 
export default Toolbar;
