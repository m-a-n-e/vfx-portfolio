import { PROJECTS } from '../constants';
import { CarouselItem } from './CarouselItem';

interface SpiralCarouselProps {
  onProjectClick: (id: string, x: number, y: number) => void;
  scrollProgressRef: React.MutableRefObject<number>;
}

export function SpiralCarousel({ onProjectClick, scrollProgressRef }: SpiralCarouselProps) {
  return (
    <group>
      {PROJECTS.map((project, index) => (
        <CarouselItem
          key={project.id}
          index={index}
          total={PROJECTS.length}
          title={project.title}
          category={project.category}
          scrollProgressRef={scrollProgressRef}
          onClick={(x, y) => onProjectClick(project.id, x, y)}
        />
      ))}
    </group>
  );
}
