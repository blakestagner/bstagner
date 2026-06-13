'use client'

export default function HeroText({ loading }) {
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className='hero-text'>
      <div className='blake-stagner'>
        <h1 id='anim1' className={loading ? 'heading-1' : 'heading-animate-1 heading-transition'}>
          BLAKE
        </h1>
        <h1 id='anim2' className={loading ? 'heading-2' : 'heading-animate-2 heading-transition'}>
          STAGNER
        </h1>
        <p id='anim3'>
          <span className={loading ? 'welcome-text' : 'welcome-text welcome-text-animation'}>Full-Stack &amp;</span>
          <span className={loading ? 'universe-text' : 'universe-text universe-text-animation'}> AI Engineer</span>
        </p>
        <div className={loading ? 'hero-cta' : 'hero-cta hero-cta--in'}>
          <button className='hero-btn hero-btn--primary' onClick={() => goTo('portfolio')}>
            View My Work
          </button>
          <button className='hero-btn hero-btn--ghost' onClick={() => goTo('contact')}>
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}
