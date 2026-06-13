'use client'

import './portfolio.scss';
import PortfolioItems from './PortfolioItems';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

export default function Portfolio() {
  const ref = useReveal();

  return (
    <section id='portfolio' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='Projects' />
        </div>
        <PortfolioItems />
      </div>
    </section>
  );
}
