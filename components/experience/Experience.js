'use client'

import './experience.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

// TODO: Replace these placeholder missions with real roles, companies, and dates.
const missions = [
  {
    id: 'mission-3',
    period: 'TODO: Start – End',
    role: 'TODO: Most recent role title',
    org: 'TODO: Company',
    summary: 'TODO: One or two sentences about what you built in this role and the impact it had.',
  },
  {
    id: 'mission-2',
    period: 'TODO: Start – End',
    role: 'TODO: Previous role title',
    org: 'TODO: Company',
    summary: 'TODO: One or two sentences about what you built in this role and the impact it had.',
  },
  {
    id: 'mission-1',
    period: 'TODO: Start – End',
    role: 'TODO: Earlier role title',
    org: 'TODO: Company',
    summary: 'TODO: One or two sentences about what you built in this role and the impact it had.',
  },
];

export default function Experience() {
  const ref = useReveal();

  return (
    <section id='experience' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='Experience' />
        </div>
        <div className='mission-log'>
          <span className='mission-path' aria-hidden='true'></span>
          {missions.map((mission, i) => (
            <article key={mission.id} className='mission' data-reveal={i % 2 ? 'right' : 'left'}>
              <span className='mission-node' aria-hidden='true'></span>
              <div className='mission-card'>
                <p className='mission-period'>{mission.period}</p>
                <h3>{mission.role}</h3>
                <p className='mission-org'>{mission.org}</p>
                <p className='mission-summary'>{mission.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
