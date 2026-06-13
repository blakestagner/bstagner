'use client'

import Toolbar from '@/components/toolbar/Toolbar';
import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Portfolio from '@/components/portfolio/Portfolio';
import Components from '@/components/sections/Components';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <div className="app">
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
