'use client'

import { useState, useEffect, useRef } from 'react';
import './toolbar.scss';

const menuIcon = '/icons/toolbar/menu-white.svg';
const closeIcon = '/icons/toolbar/close-white.svg';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'portfolio', label: 'Projects' },
  { id: 'components', label: 'Demos' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Toolbar() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState('');
  const prevScrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > prevScrollRef.current && y > 300);
      prevScrollRef.current = y;

      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          current = link.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id) => {
    setMobileNav(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`navBar ${solid ? 'navBar--solid' : ''} ${hidden && !mobileNav ? 'navBar--hidden' : ''}`}
      id='mainNav'>
      <div className='navBarContainer'>
        <p id='main-title'>
          <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BS</span>
        </p>
        <div>
          <ul id='mainMenuList'>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <p
                  className={`navList ${active === link.id ? 'active' : ''}`}
                  onClick={() => handleClick(link.id)}>
                  {link.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <img
          onClick={() => setMobileNav(!mobileNav)}
          className='menu-icon-animation'
          src={mobileNav ? closeIcon : menuIcon}
          alt='menu toggle'
        />
      </div>
      <div className={mobileNav ? 'mobile-nav open' : 'mobile-nav closed'}>
        {NAV_LINKS.map((link) => (
          <p key={link.id} onClick={() => handleClick(link.id)}>{link.label}</p>
        ))}
      </div>
    </nav>
  );
}
