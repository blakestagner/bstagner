export default function SectionTitle({ title }) {
  return (
    <div className='section-title' data-reveal>
      <h1>{title}</h1>
      <span className='title-strip' aria-hidden='true'></span>
    </div>
  );
}
