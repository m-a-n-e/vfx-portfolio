import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { PROJECTS } from '../constants';

interface OverlayProps {
  onScrollTo?: (id: string) => void;
}

export function Overlay({ onScrollTo }: OverlayProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const carouselArea = viewportHeight * 9.5;
      
      // O progresso total termina em 8 viewports
      const scrollLimit = viewportHeight * 8;
      const percent = Math.min(Math.max(scrollY / scrollLimit, 0), 1);
      
      const index = Math.min(Math.round(percent * (PROJECTS.length - 1)), PROJECTS.length - 1);
      setActiveProjectIndex(index);

      // O overlay deve ser visível enquanto estivermos na área de scroll do carrossel
      setIsVisible(scrollY < carouselArea - viewportHeight * 0.5);
    };

    // Chama uma vez para definir o estado inicial correto
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeProject = PROJECTS[activeProjectIndex];

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6 md:p-16 transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Top Header */}
      <header className="flex w-full items-start justify-between">
        <div className="space-y-1">
          <h1 className="font-mono text-[10px] font-medium tracking-[0.3em] text-white/40 md:text-xs">
            VFX PORTFOLIO / 2026
          </h1>
          <p className="font-mono text-base font-light tracking-tight text-white md:text-lg">
            EMANUEL <span className="text-white/50">DÖRNER</span>
          </p>
        </div>
        <nav className="pointer-events-auto hidden gap-8 font-mono text-[10px] tracking-widest text-white/50 md:flex">
          <button onClick={() => onScrollTo?.('projects')} className="transition-colors hover:text-white uppercase">Projects</button>
          <button onClick={() => onScrollTo?.('about')} className="transition-colors hover:text-white uppercase">About</button>
          <button onClick={() => onScrollTo?.('contact')} className="transition-colors hover:text-white uppercase">Contact</button>
        </nav>
      </header>

      {/* Center/Bottom Active Title */}
      <div className="flex w-full items-end justify-between">
        <div className="max-w-xl space-y-4 md:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject?.id || 'default'}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2 md:space-y-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-widest text-white/30 md:text-xs">
                  {String(activeProjectIndex + 1).padStart(2, '0')}
                </span>
                <div className="h-px w-6 bg-white/20 md:w-8" />
                <span className="font-mono text-[10px] tracking-widest text-white/50 md:text-xs">
                  {activeProject?.category.toUpperCase() || 'VFX'}
                </span>
              </div>
              
              <h2 className="text-4xl font-medium tracking-tighter text-white md:text-8xl">
                {activeProject?.title || 'PROJECT'}
              </h2>
              
              <p className="max-w-xs text-xs leading-relaxed text-white/50 md:max-w-md md:text-sm">
                {activeProject?.description || ''}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-auto">
            <button className="group mt-2 flex items-center gap-4 font-mono text-[9px] tracking-[0.2em] text-white md:mt-4 md:text-[10px]">
              WATCH REEL
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all group-hover:bg-white group-hover:text-black md:h-10 md:w-10">
                <span className="text-base md:text-lg">→</span>
              </div>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden flex-col items-center gap-6 md:flex">
          <div className="flex flex-col items-center font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 leading-[1.8] uppercase">
            <span>S</span>
            <span>C</span>
            <span>R</span>
            <span>O</span>
            <span>L</span>
            <span>L</span>
            <span className="my-2 h-1 w-1 rounded-full bg-white/10" />
            <span>T</span>
            <span>O</span>
            <span className="my-2 h-1 w-1 rounded-full bg-white/10" />
            <span>E</span>
            <span>X</span>
            <span>P</span>
            <span>L</span>
            <span>O</span>
            <span>R</span>
            <span>E</span>
          </div>
          <div className="h-24 w-px overflow-hidden bg-white/10">
            <motion.div
              className="h-full w-full bg-white/50"
              style={{
                originY: 0,
                scaleY: activeProjectIndex / (PROJECTS.length - 1)
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 h-4 w-4 border-t border-l border-white/20" />
      <div className="absolute top-4 right-4 h-4 w-4 border-t border-r border-white/20" />
      <div className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-white/20" />
      <div className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-white/20" />
    </div>
  );
}
