'use client'

import './experience.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

const missions = [
  {
    id: 'mission-4',
    period: 'Aug 2023 – Present',
    role: 'Senior Software Engineer',
    org: 'SleepDoctor',
    summary: 'Built a production call transcript analysis app with Next.js and the Google Gemini API, led Core Web Vitals work across properties reaching 5.7M+ monthly visits, and mentored three engineers.',
  },
  {
    id: 'mission-3',
    period: 'May 2022 – Aug 2023',
    role: 'Software Engineer',
    org: 'SleepDoctor',
    summary: 'Built React-powered recommendation and monetization experiences in WordPress using reusable Gutenberg/ACF blocks, and supported CI/CD delivery with GitHub Actions.',
  },
  {
    id: 'mission-2',
    period: 'Dec 2019 – Apr 2022',
    role: 'Front-End Developer',
    org: 'Highline College',
    summary: 'Built React and Node.js/Express dashboards and migrated legacy web experiences into a modern WordPress environment, improving page performance 40%.',
  },
  {
    id: 'mission-1',
    period: 'Jun 2016 – Dec 2019',
    role: 'Self-Employed Web Developer',
    org: 'B Stagner',
    summary: 'Built custom WordPress websites and advised clients on domain and hosting decisions.',
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
            <article key={mission.id} className='mission' data-reveal={i % 2 ? 'left' : 'right'}>
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
