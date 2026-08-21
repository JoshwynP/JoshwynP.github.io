import { useEffect, useState } from 'react';
import LiquidEther from './components/LiquidEther';
import { StaggeredMenu } from './components/StaggeredMenu';
import BlurText from './components/BlurText';
import SimpleTypewriter from './components/SimpleTypewriter';
import ElectricBorder from './components/ElectricBorder';

const LOGO_URL = '/assets/LOGO_STEAM-LiDHMAmV.png';
const RESUME_URL = '/assets/JoshwynParekhResume4A.pdf';

const NAME = 'Joshwyn Parekh';
const ABOUT =
  "Hi! I'm Joshwyn, an ambitious computer engineer at the University of Waterloo. I focus on delivering clean, professional and useful solutions for your technological needs.";

const PROJECTS = [
  {
    title: '"The Finals" Statistics Tracker',
    desc: 'Python based application which uses an OCR to extract text from the end of round scoreboard after each game to track and store statisitcs of gameplay.',
    repo: 'https://github.com/joshwynp',
    version: 'v1.0.0',
    featured: true,
  },
  {
    title: 'Sw1ft Shot',
    desc: 'Solo developing a speed-run focused target shooting game across multiple levels with varying difficulty, level theme and obstacle avoidance.',
    repo: 'https://github.com/joshwynp',
    version: 'v4.0.0',
    featured: true,
  },
  {
    title: 'Custom OS Kernel',
    desc: 'Developed a lightweight operating system kernel with a preemptive, priority-based scheduler, dynamic memory allocation, and synchronization primitives.',
    repo: 'https://github.com/joshwynp',
    version: 'v1.0.0',
    featured: true,
  },
] as const;

const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/joshwynp' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/joshwynparekh' },
  { name: 'Instagram', href: 'https://www.instagram.com/joshwyn_p/' },
] as const;

const MENU_ITEMS = [
  { label: 'Home', link: '#' },
  { label: 'Projects', link: '#projects' },
  { label: 'Resume', link: '#resume' },
  { label: 'Contact', link: '#contact' },
];

const MENU_SOCIALS = [
  { label: 'GitHub', link: 'https://github.com/joshwynp' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/joshwynparekh' },
  { label: 'Instagram', link: 'https://www.instagram.com/joshwyn_p/' },
];

function scrollToTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, 0);
  }
}

export default function App() {
  const [showName, setShowName] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {
      // ignore
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const timer = setTimeout(() => setShowName(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const resetHero = () => {
    scrollToTop();
    setShowAbout(false);
    setShowScrollHint(false);
    setShowName(false);
    setTimeout(() => setShowName(true), 10);
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased relative">
      <div className="fixed inset-0 z-0 w-full h-full">
        <LiquidEther
          className="w-full h-full"
          autoSpeed={0.35}
          takeoverDuration={0.18}
          autoResumeDelay={700}
          autoRampDuration={0.45}
          iterationsViscous={8}
          iterationsPoisson={8}
          BFECC={false}
          resolution={0.35}
        />
      </div>

      <StaggeredMenu
        position="right"
        logoUrl={LOGO_URL}
        items={MENU_ITEMS}
        socialItems={MENU_SOCIALS}
        colors={['#0b0b12', '#141424', '#1a1a2e', '#23233b']}
        accentColor="#8b5cf6"
        onNavigate={(item: { label: string; link: string }) => {
          if (item.label.toLowerCase() === 'home' || item.link === '#') {
            resetHero();
            return true;
          }
          return false;
        }}
        onLogoClick={resetHero}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-12">
        <section className="min-h-[100svh] flex flex-col items-center justify-center text-center">
          {showName && (
            <BlurText
              text={NAME}
              delay={200}
              animateBy="letters"
              direction="top"
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
              onAnimationComplete={() => setShowAbout(true)}
            />
          )}

          <div className="mt-6 max-w-3xl min-h-[3lh]">
            {showAbout && (
              <SimpleTypewriter
                text={ABOUT}
                typingSpeed={40}
                startDelay={100}
                className="text-lg sm:text-xl text-gray-300"
                onComplete={() => setShowScrollHint(true)}
              />
            )}
          </div>

          <div
            className={`mt-10 text-sm text-gray-400 transition-opacity duration-700 ${
              showScrollHint ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Scroll to explore
          </div>
        </section>

        <section id="projects" className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <ElectricBorder
                key={project.title}
                className="rounded-2xl"
                color="#8227FF"
                speed={0.7}
                chaos={0.1}
                thickness={2}
              >
                <article className="rounded-2xl px-6 py-7 bg-black/40 border border-neutral-800/70 min-h-[420px] flex flex-col">
                  <div className="flex items-center justify-between">
                    {project.featured ? (
                      <span className="text-[10px] uppercase tracking-[0.15em] text-indigo-300/90 bg-indigo-500/10 border border-indigo-500/30 px-2 py-1 rounded-md">
                        Featured
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[11px] text-gray-400">{project.version}</span>
                  </div>
                  <h3 className="mt-5 text-xl sm:text-2xl font-bold leading-tight">{project.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed flex-1">{project.desc}</p>
                  <div className="mt-6">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex justify-center px-4 py-2 border border-neutral-700 rounded-md hover:bg-white/10 transition"
                    >
                      GitHub
                    </a>
                  </div>
                </article>
              </ElectricBorder>
            ))}
          </div>
        </section>

        <section id="resume" className="mt-20">
          <h3 className="text-2xl font-bold mb-4">Experience</h3>
          <p className="text-gray-400">
            Download resume{' '}
            <a href={RESUME_URL} download className="underline">
              here
            </a>
            .
          </p>
        </section>

        <section id="contact" className="mt-20 mb-28">
          <h3 className="text-2xl font-bold mb-4">Contact</h3>
          <p className="text-gray-400">
            Email:{' '}
            <a href="mailto:joshwynparekh@gmail.com" className="underline">
              joshwynparekh@gmail.com
            </a>
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-200"
              >
                {social.name}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {NAME}
      </footer>
    </div>
  );
}
