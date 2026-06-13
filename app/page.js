'use client'

import Toolbar from '@/components/toolbar/Toolbar';
import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Portfolio from '@/components/portfolio/Portfolio';
import Components from '@/components/sections/Components';
import Footer from '@/components/footer/Footer';
import SpaceBackground from '@/components/space/SpaceBackground';

export default function Home() {
  return (
    <div className="app">
      <SpaceBackground />
      <Toolbar />
      <main id="sections">
        <Hero />
        <About />
        <Portfolio />
        <Components />
        <Footer />
      </main>
    </div>
  );
}
