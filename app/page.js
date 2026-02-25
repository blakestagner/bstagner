'use client'

import { useState, useEffect } from 'react';
import Toolbar from '@/components/toolbar/Toolbar';
import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Portfolio from '@/components/portfolio/Portfolio';
import Components from '@/components/sections/Components';
import Footer from '@/components/footer/Footer';

export default function Home() {
  const [section, setSection] = useState('hero');

  useEffect(() => {
    const sectionMap = {
      about: 'About',
      portfolio: 'Portfolio',
      components: 'Components',
      hero: 'Hero',
    };

    const observers = Object.keys(sectionMap).map(id => {
      const el = document.querySelector(`#${id}`);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSection(sectionMap[id]);
          }
        },
        { root: document.querySelector('#sections'), threshold: 0.4 }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, [])

  return (
    <div className="app">
      <Toolbar section={section} />
      <div id="sections">
        <Hero />
        <About section={section} />
        <Portfolio section={section} />
        <Components section={section} />
        <Footer />
      </div>
    </div>
  )
}
