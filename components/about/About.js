'use client'

import './about.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

const blakeImg = '/images/about/blake.webp';

export default function About() {
  const ref = useReveal();

  return (
    <section id='about' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='About' />
        </div>
        <div className='about-panel' data-reveal='scale'>
          <div className='bio'>
            <div>
              <img className='blake-img' src={blakeImg} alt='Blake Stagner' />
              <p className='mobile-intro'>
                <span>Senior Full-Stack Engineer</span> — 7+ years shipping production software with Claude, ChatGPT, Gemini, React, Node.js, and Flutter.
              </p>
            </div>
            <div>
              <p>
                <span>Senior Full-Stack Engineer</span> with 7+ years shipping production software — from React frontends and Node.js APIs to AI-powered products built with Claude, ChatGPT, and Gemini. I specialize in turning AI capabilities into real business outcomes.
              </p>
              <p>
                <span>Results?</span> Built an AI call transcript grader that improved CPAP conversions by 15% in 3 months. Delivered a ChatGPT-powered mattress recommendation widget, a RAG chatbot with Google Gemini, a self-serve A/B testing platform, and a cross-platform Flutter mobile app — all at scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
