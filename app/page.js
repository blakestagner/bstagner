'use client'

import Toolbar from '@/components/toolbar/Toolbar';
import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Portfolio from '@/components/portfolio/Portfolio';
import Components from '@/components/sections/Components';
import Experience from '@/components/experience/Experience';
import Footer from '@/components/footer/Footer';
import SpaceBackground from '@/components/space/SpaceBackground';
import Space3D from '@/components/space3d/Space3D';
import Skills from '@/components/skills/Skills';

export default function Home() {
  return (
    <div className="app">
      <SpaceBackground />
      <Space3D />
      <Toolbar />
      <main id="sections">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Portfolio />
        <Components />
        <Footer />
      </main>
    </div>
  );
}
