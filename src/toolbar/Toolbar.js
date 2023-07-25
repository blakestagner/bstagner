import { useState } from 'react';
import './toolbar.scss';

import closeWhite from './img/close-white.svg';
import closeBlack from './img/close-black.svg';
import menuWhite from './img/menu-white.svg';
import menuBlack from './img/menu-black.svg';

function Toolbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuToggle, setMenuToggle] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(menuWhite);
  const [mobileNav, setMobileNav] = useState(false);
  const [navHide, setNavHide] = useState(true);
  let prevScrollpos = window.pageYOffset;

  window.addEventListener('load', () => {
    const section = document.querySelector('#sections');
    section.addEventListener('scroll', sectionScroll);
  });

  const sectionScroll = () => {
    const windowScroll = () => {
      const hero = document.querySelector('#hero');
      let currentScrollPos = hero.getBoundingClientRect().y * -1;
      if (currentScrollPos * -1 === -0) {
        setScrolled(false);
        if (mobileMenu === menuBlack || mobileMenu === closeBlack) {
          if (mobileMenu === menuBlack) {
            setMobileMenu(menuWhite);
          } else {
            setMobileMenu(closeWhite);
          }
        } else {
          if (mobileMenu === menuWhite) {
            setMobileMenu(menuWhite);
          } else {
            setMobileMenu(closeWhite);
          }
        }
      } else {
        setScrolled(true);
        if (mobileMenu === menuWhite || mobileMenu === closeWhite) {
          if (mobileMenu === menuWhite) {
            setMobileMenu(menuBlack);
          } else setMobileMenu(closeBlack);
        }
      }
    };

    const scrollNavHide = () => {
      const hero = document.querySelector('#hero');
      let currentScrollPos = hero.getBoundingClientRect().y * -1;
      if (currentScrollPos * -1 === -0) {
        setNavHide(true);
      } else if (prevScrollpos > currentScrollPos) {
        setNavHide(true);
      } else {
        setNavHide(false);
      }
      prevScrollpos = currentScrollPos;
    };
    windowScroll();
    scrollNavHide();
  };

  const mobileMenuToggle = () => {
    setMenuToggle(menuToggle === true ? false : true);
    setMobileNav(mobileNav === true ? false : true);
    if (mobileMenu === menuWhite || mobileMenu === menuBlack) {
      if (mobileMenu === menuWhite) {
        setTimeout(() => {
          setMenuToggle(false);
          setMobileMenu(closeWhite);
        }, 200);
      } else {
        setTimeout(() => {
          setMenuToggle(false);
          setMobileMenu(closeBlack);
        }, 200);
      }
    } else if (mobileMenu === closeWhite || mobileMenu === closeBlack) {
      if (mobileMenu === closeWhite) {
        setTimeout(() => {
          setMenuToggle(false);
          setMobileMenu(menuWhite);
        }, 200);
      } else {
        setTimeout(() => {
          setMenuToggle(false);
          setMobileMenu(menuBlack);
        }, 200);
      }
    }
  };
  const handleClick = (link) => {
    setMobileNav(false);
    const anchor = document.querySelector(link);
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' }, true);
  };

  return (
    <div
      className={`${scrolled ? 'navBar scrollBar' : 'navBar'} ${
        navHide ? '' : 'scrolled'
      }`}
      id='mainNav'>
      <div className='navBarContainer'>
        <p id='main-title'>
          <span onClick={() => handleClick('#hero')}>BS</span>
        </p>
        <div>
          <ul id='mainMenuList'>
            <li>
              <p className='navList' onClick={() => handleClick('#about')}>
                About
              </p>
            </li>
            <li>
              <p className='navList' onClick={() => handleClick('#portfolio')}>
                Portfolio
              </p>
            </li>
            <li>
              <p className='navList' onClick={() => handleClick('#components')}>
                Components
              </p>
            </li>
            <li>
              <p className='navList' onClick={() => handleClick('#contact')}>
                Contact
              </p>
            </li>
          </ul>
        </div>
        <img
          onClick={() => mobileMenuToggle()}
          className={menuToggle ? 'menu-icon' : 'menu-icon-animation'}
          src={mobileMenu}
          alt='menu toggle'
        />
      </div>
      <MobileNavMenu
        handleClick={(section) => handleClick(section)}
        toggled={mobileNav}
      />
    </div>
  );
}
export default Toolbar;

function MobileNavMenu({ toggled, handleClick }) {
  return (
    <div className={toggled ? 'mobile-nav open' : 'mobile-nav closed'}>
      <p onClick={() => handleClick('#about')}>About</p>
      <p onClick={() => handleClick('#portfolio')}>Portfolio</p>
      <p onClick={() => handleClick('#components')}>Components</p>
      <p onClick={() => handleClick('#contact')}>Contact</p>
    </div>
  );
}
