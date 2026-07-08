'use client';

import './portfolio.scss';

const portfolioDetails = [
  {
    name: 'AI Call Transcript Grader',
    employer: 'SleepDoctor',
    description: 'AI-powered grading system for sales call transcripts that identifies coaching opportunities and optimizes CPAP conversion scripts.',
    impact: 'Improved CPAP conversions 15% in 3 months',
    techStack: ['Google Gemini', 'Next.js', 'React', 'SQL'],
    isAI: true,
  },
  {
    name: 'ChatGPT Mattress Finder',
    employer: 'SleepDoctor',
    description: 'In-chat widget powered by ChatGPT that delivers personalized mattress recommendations based on user sleep preferences.',
    impact: 'Personalized recommendations at scale',
    techStack: ['OpenAI ChatGPT', 'React', 'Node.js', 'WordPress'],
    isAI: true,
  },
  {
    name: 'RAG Chatbot',
    employer: 'SleepDoctor',
    description: 'Retrieval-augmented generation chatbot using Google Gemini and company web content to guide users through sleep health resources.',
    impact: 'Automated user guidance with company knowledge base',
    techStack: ['Google Gemini', 'RAG', 'Node.js', 'React'],
    isAI: true,
  },
  {
    name: 'A/B Testing Platform',
    employer: 'SleepDoctor',
    description: 'Internal WordPress-based experimentation platform enabling configurable CTA tests with automated deployment of winning variants.',
    impact: 'Self-serve experiments with auto-winner implementation',
    techStack: ['WordPress', 'PHP', 'SQL', 'Snowflake'],
    isAI: false,
  },
  {
    name: 'React WordPress Plugin',
    employer: 'SleepDoctor',
    description: 'Sleep product comparison tool built as a React-powered WordPress plugin, deployed across multiple web properties.',
    impact: 'Cross-property product comparison at scale',
    techStack: ['React', 'PHP', 'WordPress'],
    isAI: false,
  },
  {
    name: 'Flutter Mobile App',
    employer: 'SleepDoctor',
    description: 'Cross-platform iOS and Android mobile application for SleepFoundation.org and SleepDoctor.com content delivery.',
    impact: 'Cross-platform mobile presence on iOS & Android',
    techStack: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android'],
    isAI: false,
  },
  {
    name: 'React + Node.js Dashboards',
    employer: 'Highline College',
    description: 'WordPress editor monitoring and search tooling dashboards for content management and site performance tracking.',
    impact: 'Editor monitoring & search tooling for content teams',
    techStack: ['React', 'Node.js', 'Express', 'SQL'],
    isAI: false,
  },
];

export default function PortfolioItems() {
  return (
    <div className="portfolio-grid">
      {portfolioDetails.map((project, i) => (
        <div
          key={project.name}
          className={`project-card ${project.isAI ? 'project-card--ai' : ''}`}
          data-reveal={i % 2 ? 'right' : 'left'}
        >
          <div className="project-card-header">
            <p className="project-name">{project.name}</p>
            {project.isAI && <span className="ai-badge">AI</span>}
          </div>
          <p className="project-employer">{project.employer}</p>
          <p className="project-description">{project.description}</p>
          <p className="project-impact">{project.impact}</p>
          <div className="project-tech-stack">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
