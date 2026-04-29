/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThreeCanvas } from './components/ThreeCanvas';
import { Overlay } from './components/Overlay';
import { ProjectDetail } from './components/ProjectDetail';
import { CustomCursor } from './components/CustomCursor';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { PROJECTS } from './constants';
import { Mail, Instagram, Linkedin, ArrowRight, Quote, ArrowUp } from 'lucide-react';
import { useEffect } from 'react';

function TextShapeFill({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.span 
      className={`relative inline-block align-top group/fill ${className}`}
      initial="initial"
      whileHover="hover"
    >
      {/* Camada Base (Cinza) */}
      <span className="block text-white/20 pr-[0.3em]">{children}</span>
      
      {/* Camada de Revelação (Branco) */}
      <motion.span 
        variants={{
          initial: { clipPath: "inset(0 100% 0 0)" },
          hover: { clipPath: "inset(0 0 0 0)" }
        }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 block text-white select-none pointer-events-none pr-[0.3em]"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

function SkillCard({ skill, index }: { skill: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Valores para a posição absoluta do mouse para o círculo de revelação
  const mousePosX = useMotionValue(0);
  const mousePosY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });
  const circleRadius = useSpring(isHovered, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  
  const clipPath = useTransform(
    [mousePosX, mousePosY, circleRadius],
    (latest) => {
      const [px, py, radius] = latest as number[];
      return `circle(${radius * 150}% at ${px}px ${py}px)`;
    }
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Rotação 3D
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);

    // Posição para o círculo
    mousePosX.set(e.clientX - rect.left);
    mousePosY.set(e.clientY - rect.top);
    isHovered.set(1);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
    isHovered.set(0);
  }

  const CardContent = ({ variant }: { variant: 'base' | 'reveal' }) => (
    <div className={`relative h-full p-8 transition-colors ${
      variant === 'base' 
        ? "bg-white/[0.03] text-white" 
        : "bg-white text-black"
    }`}>
      {variant === 'base' && (
        <div style={{ transform: "translateZ(-20px)" }} className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
      )}
      
      <div className="relative z-10 flex h-full flex-col justify-between space-y-8">
        <div style={{ transform: "translateZ(50px)" }} className="space-y-4">
          <h4 className={`font-mono text-xs tracking-[0.3em] uppercase ${variant === 'base' ? 'text-white/90' : 'text-black/90'}`}>
            {skill.title}
          </h4>
          <div className={`h-px w-full ${variant === 'base' ? 'bg-white/20' : 'bg-black/20'}`} />
        </div>
        <p 
          style={{ transform: "translateZ(30px)" }} 
          className={`text-justify text-[13px] leading-relaxed ${variant === 'base' ? 'text-white/60' : 'text-black/80'}`}
          dangerouslySetInnerHTML={{ __html: skill.description }}
        />
      </div>
    </div>
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      style={{ perspective: 1000 }}
      className="group relative h-full cursor-none hover:z-50"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {/* Camada Base (Escura) */}
        <CardContent variant="base" />

        {/* Camada de Revelação (Branca) */}
        <motion.div
          style={{ clipPath, transformStyle: "preserve-3d" }}
          className="absolute inset-0 z-10"
        >
          <CardContent variant="reveal" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const lenis = useSmoothScroll();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'circle' | 'fade'>('circle');
  const [clickPos, setClickPos] = useState({ x: 50, y: 50 });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 8.5;
      setShowBackToTop(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectClick = (projectId: string, x: number, y: number) => {
    lastScrollY.current = window.scrollY;
    setTransitionType('circle');
    setClickPos({ x: (x / window.innerWidth) * 100, y: (y / window.innerHeight) * 100 });
    setIsTransitioning(true);
    
    // Swap content exactly when the circle has filled the screen
    setTimeout(() => {
      setSelectedProjectId(projectId);
      window.scrollTo(0, 0);
      if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
    }, 700);

    // Fade out the overlay after the new content is ready
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  const handleBack = (x: number = window.innerWidth / 2, y: number = window.innerHeight / 2) => {
    setTransitionType('fade');
    setClickPos({ x: (x / window.innerWidth) * 100, y: (y / window.innerHeight) * 100 });
    setIsTransitioning(true);
    
    // Swap content mid-fade
    setTimeout(() => {
      setSelectedProjectId(null);
      // Use a slight delay to ensure Home is mounted before scrolling
      setTimeout(() => {
        window.scrollTo(0, lastScrollY.current);
        if (lenis.current) lenis.current.scrollTo(lastScrollY.current, { immediate: true });
      }, 50);
    }, 400);

    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);

  const skills = [
    { 
      title: "VFX & Compositing", 
      description: "Specialist in seamless integration of CGI elements into live-action. Technical mastery in advanced rotoscoping, high-fidelity keying, and lighting pass reconstruction for absolute photorealism." 
    },
    { 
      title: "Sound Design", 
      description: "Immersive sonic architecture designed to drive emotional narrative. Development of rich auditory landscapes, precision digital foley, and spatial mixing that expands viewer perception." 
    },
    { 
      title: "Motion Graphics", 
      description: "Creation of dynamic visual systems and experimental kinetic typography. Focus on organic movement fluidity and procedural design balancing minimalist aesthetics with 3D technical complexity." 
    },
    { 
      title: "Color Science", 
      description: "Look development grounded in color science. Strategic cinematic grading to establish psychological atmospheres and ensure tonal consistency in complex post-production pipelines." 
    }
  ];

  return (
    <main className="relative bg-black text-white min-h-screen overflow-x-hidden">
      <CustomCursor />
      
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            initial={transitionType === 'circle' 
              ? { clipPath: `circle(0% at ${clickPos.x}% ${clickPos.y}%)`, opacity: 1 }
              : { opacity: 0 }
            }
            animate={transitionType === 'circle'
              ? { clipPath: `circle(150% at ${clickPos.x}% ${clickPos.y}%)`, opacity: 1 }
              : { opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ 
              duration: transitionType === 'circle' ? 1.2 : 0.8, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="fixed inset-0 z-[100] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackToTop && !selectedProjectId && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => {
              if (lenis.current) {
                lenis.current.scrollTo(0, { duration: 2 });
              }
            }}
            className="fixed bottom-12 right-12 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition-all hover:bg-white hover:text-black"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-0">
        {!selectedProjectId ? (
          <div key="home-container">
            <ThreeCanvas onProjectClick={handleProjectClick} />
            <Overlay onScrollTo={(id) => {
              if (lenis.current) {
                const target = id === 'projects' ? 0 : `#${id}`;
                lenis.current.scrollTo(target, { duration: 1.5 });
              }
            }} />
            
            <div className="pointer-events-none relative h-[950vh] w-full" />
            
            {/* Trajectory Section */}
            <section id="about" className="relative z-20 bg-black px-8 py-24 md:px-16 border-t border-white/10">
              <div className="mx-auto max-w-7xl border-x border-white/10">
                <div className="grid lg:grid-cols-2 items-stretch">
                  <div className="p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center">
                    <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6">Trajectory</span>
                    <h2 className="text-5xl font-medium leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
                      VISION TO <br />
                      <TextShapeFill className="font-mono italic">REALITY</TextShapeFill>
                    </h2>
                  </div>

                  <div className="p-12 flex flex-col justify-center">
                    <div className="space-y-12">
                      <div className="relative">
                        <p className="text-justify text-xl leading-[1.6] text-white/90 md:text-2xl font-light tracking-tight italic">
                          <span className="inline-block mr-4 align-top text-white">
                            <Quote size={32} className="rotate-180" fill="currentColor" strokeWidth={0} />
                          </span>
                          Acting as a video editor and VFX artist since 2021, I navigate between high-performance production houses and complex freelance challenges.
                          <span className="inline-block ml-4 align-bottom text-white">
                            <Quote size={32} fill="currentColor" strokeWidth={0} />
                          </span>
                        </p>
                      </div>
                      <p className="text-justify text-sm leading-relaxed text-white/50 font-medium">
                        My journey is built on technical mastery to translate any concept into a tangible, high-impact visual piece. I possess the creative flexibility to sculpt any raw material into a high-end cinematic experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="relative z-20 bg-black px-8 py-24 md:px-16 border-t border-white/10">
              <div className="mx-auto max-w-7xl border-x border-white/10">
                <div className="p-12 border-b border-white/10">
                  <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-4 block">Expertise</span>
                  <h2 className="text-4xl font-medium tracking-tighter md:text-6xl">TECHNICAL STACKS</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                  {skills.map((skill, i) => (
                    <div key={skill.title} className={`border-b border-white/10 ${i % 4 !== 3 ? 'lg:border-r' : ''} ${i % 2 !== 1 ? 'md:border-r' : ''}`}>
                      <SkillCard skill={skill} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <section id="contact" className="relative z-20 bg-black px-8 py-24 md:px-16 border-y border-white/10">
              <div className="mx-auto max-w-7xl border-x border-white/10">
                <div className="grid lg:grid-cols-2 items-stretch">
                  <div className="flex flex-col justify-between space-y-12 p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                    <div className="space-y-8">
                      <h3 className="text-4xl font-light tracking-tight text-white/90 md:text-5xl lg:text-6xl">
                        LET'S BUILD <br />
                        <TextShapeFill className="font-mono italic">SOMETHING EPIC</TextShapeFill>
                      </h3>
                      <p className="max-w-md text-sm leading-relaxed text-white/40">
                        Whether you have a specific project in mind or just want to explore possibilities, I'm here to bring your vision to life.
                      </p>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                      <a href="#" className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 transition-all hover:bg-white hover:text-black">
                        <Instagram size={18} />
                      </a>
                      <a href="#" className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 transition-all hover:bg-white hover:text-black">
                        <Linkedin size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="p-12 flex flex-col justify-center pointer-events-auto">
                    <form className="grid gap-8">
                      <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] tracking-widest text-white/30 uppercase">Your Name</label>
                          <input 
                            type="text" 
                            placeholder="John Doe"
                            className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-white outline-none transition-colors focus:border-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] tracking-widest text-white/30 uppercase">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="john@example.com"
                            className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-white outline-none transition-colors focus:border-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] tracking-widest text-white/30 uppercase">Project Details & Budget</label>
                        <textarea 
                          rows={4}
                          placeholder="Tell me a bit about your project..."
                          className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-white outline-none transition-colors focus:border-white resize-none"
                        />
                      </div>
                      <button className="group flex w-fit items-center gap-6 font-mono text-[10px] tracking-[0.3em] text-white/60 hover:text-white transition-colors">
                        SEND REQUEST 
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-all group-hover:bg-white group-hover:text-black">
                          <ArrowRight size={16} />
                        </div>
                      </button>
                    </form>
                  </div>
                </div>

                <div className="p-12 border-t border-white/10 flex justify-center font-mono text-[10px] tracking-widest text-white/40 uppercase">
                  <span>© 2026 Emanuel Doerner</span>
                </div>
              </div>
            </section>
          </div>
        ) : (
          selectedProject && (
            <ProjectDetail key="project-detail" project={selectedProject} onBack={handleBack} />
          )
        )}
      </div>
    </main>
  );
}

