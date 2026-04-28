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
import { Mail, Instagram, Linkedin, ArrowRight, Quote } from 'lucide-react';

function TextShapeFill({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.span 
      // Adicionado padding-right para compensar a inclinação do itálico e evitar corte
      className={`relative inline-block pr-4 overflow-hidden group/fill ${className}`}
      initial="initial"
      whileHover="hover"
    >
      {/* Camada Base (Cinza) */}
      <span className="text-white/20 whitespace-nowrap">{children}</span>
      
      {/* Camada de Revelação (Branco) */}
      <motion.span 
        variants={{
          initial: { clipPath: "inset(0 100% 0 0)" },
          hover: { clipPath: "inset(0 0 0 0)" }
        }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-0 left-0 text-white select-none pointer-events-none whitespace-nowrap"
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

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

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
      className="group relative"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full space-y-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:bg-white/[0.06] hover:border-white/20"
      >
        <div style={{ transform: "translateZ(50px)" }} className="space-y-4">
          <div className="h-px w-full bg-white/10" />
          <h4 className="font-mono text-xs tracking-[0.3em] text-white/70 uppercase">{skill.title}</h4>
        </div>
        <p style={{ transform: "translateZ(30px)" }} className="text-justify text-xs leading-relaxed text-white/30 group-hover:text-white/50 transition-colors">
          {skill.description}
        </p>
        <div style={{ transform: "translateZ(-20px)" }} className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  useSmoothScroll();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'circle' | 'fade'>('circle');
  const [clickPos, setClickPos] = useState({ x: 50, y: 50 });

  const handleProjectClick = (projectId: string, x: number, y: number) => {
    setTransitionType('circle');
    setClickPos({ x: (x / window.innerWidth) * 100, y: (y / window.innerHeight) * 100 });
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedProjectId(projectId);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 800);
  };

  const handleBack = () => {
    setTransitionType('fade');
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedProjectId(null);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 600);
  };

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);

  const skills = [
    { title: "VFX", description: "Advanced compositing, particle simulations, and high-end visual storytelling." },
    { title: "SFX", description: "Immersive sound design and spatial audio engineering that brings depth to every frame." },
    { title: "MOTION", description: "Dynamic 3D motion graphics and experimental kinetic typography." },
    { title: "COLOR", description: "Cinematic color grading and look development to define the atmosphere." }
  ];

  return (
    <main className="relative bg-black text-white min-h-screen overflow-x-hidden">
      <CustomCursor />
      
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={transitionType === 'circle' 
              ? { clipPath: `circle(0% at ${clickPos.x}% ${clickPos.y}%)`, opacity: 1 }
              : { opacity: 0 }
            }
            animate={transitionType === 'circle'
              ? { clipPath: `circle(150% at ${clickPos.x}% ${clickPos.y}%)`, opacity: 1 }
              : { opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: transitionType === 'circle' ? 0.8 : 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-0">
        {!selectedProjectId ? (
          <div key="home">
            <ThreeCanvas onProjectClick={handleProjectClick} />
            <Overlay />
            
            <div className="pointer-events-none relative h-[800vh] w-full" />
            
            {/* Trajectory Section */}
            <section className="relative z-20 bg-black px-8 py-32 md:px-16">
              <div className="mx-auto max-w-7xl">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
                  <div className="space-y-6">
                    <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">Trajectory</span>
                    <h2 className="text-5xl font-medium leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
                      VISION TO <br />
                      <TextShapeFill className="font-mono italic">REALITY</TextShapeFill>
                    </h2>
                  </div>

                  <div className="lg:pl-8">
                    <div className="flex flex-col gap-12 md:flex-row md:items-start">
                      <div className="space-y-12">
                        <div className="relative">
                          <p className="text-justify text-xl leading-[1.6] text-white/80 md:text-2xl font-light tracking-tight italic">
                            <span className="inline-block mr-4 align-top text-white/20">
                              <Quote size={32} className="rotate-180" />
                            </span>
                            Working as a video editor since 2021, I have navigated through high-performance production houses and complex freelance challenges.
                            <span className="inline-block ml-4 align-bottom text-white/20">
                              <Quote size={32} />
                            </span>
                          </p>
                        </div>
                        <p className="text-justify text-sm leading-relaxed text-white/40">
                          My journey is built on the technical mastery to translate any concept into a tangible, high-impact video. I possessed the creative flexibility to edit any footage and turn it into a high-end visual experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="relative z-20 bg-black px-8 py-32 md:px-16">
              <div className="mx-auto max-w-7xl">
                <div className="mb-24 space-y-2">
                  <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">Expertise</span>
                  <h2 className="text-4xl font-medium tracking-tighter md:text-6xl">TECHNICAL STACKS</h2>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {skills.map((skill, i) => (
                    <SkillCard key={skill.title} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <section className="relative z-20 bg-black px-8 py-32 md:px-16">
              <div className="mx-auto max-w-7xl">
                <div className="h-px w-full bg-white/10" />
                <div className="mt-32 flex flex-col justify-between gap-16 md:flex-row md:items-stretch">
                  <div className="flex flex-col justify-between space-y-12">
                    <h3 className="text-4xl font-light tracking-tight text-white/90 md:text-5xl">
                      READY FOR THE <br />
                      <TextShapeFill className="font-mono italic">NEXT CHALLENGE?</TextShapeFill>
                    </h3>
                    <button className="pointer-events-auto group flex w-fit items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-white/60 hover:text-white transition-colors">
                      START A CONVERSATION <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="flex flex-row gap-6 pointer-events-auto md:flex-col md:justify-between md:items-end">
                    <a href="mailto:contact@emanueldorner.com" className="group flex h-12 w-14 items-center justify-center rounded-full border border-white/10 transition-all hover:bg-white hover:text-black">
                      <Mail size={18} />
                    </a>
                    <a href="#" className="group flex h-12 w-14 items-center justify-center rounded-full border border-white/10 transition-all hover:bg-white hover:text-black">
                      <Instagram size={18} />
                    </a>
                    <a href="#" className="group flex h-12 w-14 items-center justify-center rounded-full border border-white/10 transition-all hover:bg-white hover:text-black">
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
                <div className="mt-32 flex justify-between font-mono text-[10px] tracking-widest text-white/10 uppercase">
                  <span>© 2026 Emanuel Dörner</span>
                  <span>Worldwide</span>
                </div>
              </div>
            </section>
          </div>
        ) : (
          selectedProject && (
            <ProjectDetail project={selectedProject} onBack={handleBack} />
          )
        )}
      </div>
    </main>
  );
}
