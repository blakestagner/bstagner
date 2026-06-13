'use client'

import './skills.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';
import { skillCategories } from '@/lib/data/skills';

export default function Skills() {
  const ref = useReveal();

  return (
    <section id='skills' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='Skills' />
        </div>
        <div className='constellation-grid'>
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className={`constellation ${cat.id === 'ai' ? 'constellation--ai' : ''}`}
              data-reveal>
              <h3>{cat.title}</h3>
              <div className='skill-nodes'>
                {cat.skills.map((skill) => (
                  <span key={skill} className='skill-node'>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
