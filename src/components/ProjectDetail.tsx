import { motion } from 'motion/react';
import { Project } from '../constants';
import { ArrowLeft, Play, Cpu, Film, Users } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: (x: number, y: number) => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-[60] min-h-screen bg-black text-white selection:bg-white selection:text-black"
    >
      <div className="flex flex-col">
        {/* Header Grid */}
        <header className="px-8 pt-8 md:px-16 md:pt-16 border-b border-white/10">
          <div className="mx-auto max-w-7xl border-x border-t border-white/10">
            <div className="flex w-full items-center justify-between p-12">
              <button 
                onClick={(e) => onBack(e.clientX, e.clientY)}
                className="group flex items-center gap-4 font-mono text-[10px] tracking-widest text-white/50 transition-colors hover:text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all group-hover:bg-white group-hover:text-black">
                  <ArrowLeft size={14} />
                </div>
                BACK TO PROJECTS
              </button>
              <div className="text-right">
                <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-1">
                  Category
                </p>
                <p className="font-mono text-[10px] tracking-widest text-white/70 uppercase">
                  {project.category}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section Grid */}
        <section className="px-8 md:px-16">
          <div className="mx-auto max-w-7xl border-x border-white/10">
            <div className="grid lg:grid-cols-2 items-stretch">
              <div className="p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center space-y-8">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl font-medium tracking-tighter md:text-7xl lg:text-8xl leading-[0.95]"
                >
                  {project.title}
                </motion.h1>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <button className="flex items-center gap-6 group">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                      <Play fill="black" size={20} />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.4em] text-white/50 group-hover:text-white transition-colors">WATCH THE REEL</span>
                  </button>
                </motion.div>
              </div>

              {/* O vídeo agora é um Iframe do YouTube ocupando o espaço do grid */}
              <div 
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('vfx-hide-cursor'))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('vfx-show-cursor'))}
                className="border-b lg:border-b-0 bg-black relative min-h-[400px] lg:min-h-full overflow-hidden"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <iframe
                    className="w-full h-full border-0"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0&modestbranding=1"
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="px-8 md:px-16 pb-24 border-t border-white/10">
          <div className="mx-auto max-w-7xl border-x border-white/10">
            <div className="grid md:grid-cols-3 items-stretch">
              {/* The Vision */}
              <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 space-y-6">
                <div className="flex items-center gap-4 text-white/30">
                  <Film size={16} />
                  <span className="font-mono text-[10px] tracking-widest uppercase">The Vision</span>
                </div>
                <p className="text-justify text-[13px] leading-relaxed text-white/60 font-medium">
                  {project.description}
                  <br /><br />
                  Every frame was meticulously sculpted to ensure the narrative weight matches the visual impact. We focused on atmospheric storytelling through subtle VFX and organic motion.
                </p>
              </div>

              {/* Technical Specs */}
              <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 space-y-6">
                <div className="flex items-center gap-4 text-white/30">
                  <Cpu size={16} />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Technical Specs</span>
                </div>
                <ul className="space-y-4 font-mono text-[10px] tracking-widest text-white/50">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Software</span>
                    <span className="text-white/80">AE / Resolve</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Workflow</span>
                    <span className="text-white/80">ACES Pipeline</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Resolution</span>
                    <span className="text-white/80">4K DCI</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>VFX Pass</span>
                    <span className="text-white/80">High-End Compositing</span>
                  </li>
                </ul>
              </div>

              {/* Credits */}
              <div className="p-12 space-y-6">
                <div className="flex items-center gap-4 text-white/30">
                  <Users size={16} />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Credits</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-mono text-[9px] text-white/20 uppercase mb-1">Director / VFX</p>
                    <p className="text-sm text-white/70">Emanuel Doerner</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-white/20 uppercase mb-1">Sound Design</p>
                    <p className="text-sm text-white/70">Digital Audio Labs</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-white/20 uppercase mb-1">Production</p>
                    <p className="text-sm text-white/70">Studio X Reality</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="p-12 border-t border-white/10 flex justify-between items-center font-mono text-[10px] tracking-widest text-white/40 uppercase">
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
