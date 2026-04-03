'use client'

import './about.scss';
import { useState, useEffect, useRef } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';

const blakeImg = '/images/about/blake.webp';

const skillCategories = [
  {
    id: 'ai',
    title: 'AI & Growth',
    skills: ['Anthropic Claude', 'OpenAI ChatGPT', 'Google Gemini', 'RAG Systems', 'A/B Testing', 'Conversion Optimization'],
  },
  {
    id: 'languages',
    title: 'Languages & Frameworks',
    skills: ['JavaScript', 'TypeScript', 'PHP', 'React', 'Next.js', 'Node.js', 'Express', 'React Native', 'WordPress'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    skills: ['Flutter', 'Dart', 'Android', 'iOS', 'React Native'],
  },
  {
    id: 'infra',
    title: 'Data & Infrastructure',
    skills: ['SQL', 'Snowflake', 'Firebase', 'Docker', 'GitHub Actions', 'Cloudflare', 'Netlify', 'Nginx'],
  },
];

export default function About({ section }) {
    const [inView, setInView] = useState(false);
    const [tabHeader, setTabHeader] = useState(0);
    const [tabContent, setTabContent] = useState(0);
    const [tabTransition, setTabTransition] = useState(0);

    const handleTabs = (tab) => {
        setTabHeader(tab);
        setTabTransition(1);
        setTimeout(() => {
            setTabTransition(0);
            setTabContent(tab);
        }, 500);
    };

    useEffect(() => {
        if (section === 'About') {
            setInView(true);
        }
    }, [section]);

    return (
        <div id='about'>
            <div className='main-container'>
                <div className='heading'>
                    <SectionTitle title='About' inView={inView} />
                    <div className='flex-center header-tab'>
                        <h2 onClick={() => handleTabs(0)} className={tabHeader === 0 ? 'active' : ''}>
                            About Me
                        </h2>
                        <h2 onClick={() => handleTabs(1)} className={tabHeader === 1 ? 'active' : ''}>
                            Skills
                        </h2>
                    </div>
                </div>
                <div className={tabTransition === 0 ? 'about-tab' : 'about-tab tab-transition'}>
                    {tabContent === 0 ? (
                        <div className='bio'>
                            <div>
                                <img className='blake-img' src={blakeImg} alt='Blake Stagner' />
                                <p className='mobile-intro'><span>Senior Full-Stack &amp; AI Engineer</span> — 7+ years shipping production software with Claude, ChatGPT, Gemini, React, Node.js, and Flutter.</p>
                            </div>
                            <div>
                                <p><span>Senior Full-Stack &amp; AI Engineer</span> with 7+ years shipping production software — from React frontends and Node.js APIs to AI-powered products built with Claude, ChatGPT, and Gemini. I specialize in turning AI capabilities into real business outcomes.</p>
                                <p><span>Results?</span> Built an AI call transcript grader that improved CPAP conversions by 15% in 3 months. Delivered a ChatGPT-powered mattress recommendation widget, a RAG chatbot with Google Gemini, a self-serve A/B testing platform, and a cross-platform Flutter mobile app — all at scale.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="skills-grid">
                            {skillCategories.map((cat) => (
                                <div key={cat.id} className={`skill-card ${cat.id === 'ai' ? 'skill-card--ai' : ''}`}>
                                    <h3>{cat.title}</h3>
                                    <div className="skill-tags">
                                        {cat.skills.map((skill) => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
