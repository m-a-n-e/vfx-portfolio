import { motion } from 'motion/react';
import { Project } from '../constants';
import { ArrowLeft, Play } from 'lucide-react';

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
      className="fixed inset-0 z-[60] flex flex-col bg-black text-white"
    >
      {/* Header */}
      <header className="flex w-full items-center justify-between p-8 md:p-16">
        <button 
          onClick={(e) => onBack(e.clientX, e.clientY)}
          className="group flex items-center gap-4 font-mono text-xs tracking-widest text-white/50 transition-colors hover:text-white"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all group-hover:bg-white group-hover:text-black">
            <ArrowLeft size={16} />
          </div>
          BACK TO PROJECTS
        </button>
        <div className="text-right">
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
            Category
          </p>
          <p className="font-mono text-xs tracking-widest text-white/70 uppercase">
            {project.category}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center px-8 md:px-16">
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-6xl font-medium tracking-tighter md:text-9xl">
                  {project.title}
                </h1>
                <p className="max-w-md text-justify text-lg leading-relaxed text-white/50">
                  {project.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <button className="flex items-center gap-6 group">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                    <Play fill="black" size={24} />
                  </div>
                  <span className="font-mono text-xs tracking-[0.3em]">PLAY REEL</span>
                </button>
              </motion.div>
            </div>

            {/* Video Placeholder / Thumbnail */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative aspect-video overflow-hidden rounded-lg bg-white/5"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-mono text-[10px] tracking-widest text-white/20 uppercase">
                  Video Preview Placeholder
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative background text */}
      <div className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/2 select-none">
        <h2 className="text-[20vw] font-bold text-white/[0.02] whitespace-nowrap uppercase">
          {project.title}
        </h2>
      </div>
    </motion.div>
  );
}
