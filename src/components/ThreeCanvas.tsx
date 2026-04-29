import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { SpiralCarousel } from './SpiralCarousel';
import { Particles } from './Particles';
import { Environment } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';

interface ThreeCanvasProps {
  onProjectClick: (id: string, x: number, y: number) => void;
}

export function ThreeCanvas({ onProjectClick }: ThreeCanvasProps) {
  const scrollRef = useRef(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalArea = viewportHeight * 9.5; // 950vh
      const carouselEnd = viewportHeight * 8; // Onde o movimento termina
      
      // O progresso do carrossel atinge 1.0 aos 8 viewports
      const percent = Math.min(scrollY / carouselEnd, 1);
      scrollRef.current = percent;

      // Fade out do canvas começa apenas após o período de "dwell" do último vídeo
      // Agora começa aos 8.5 viewports (sobra 1 viewport para o fade total)
      if (scrollY > totalArea - viewportHeight) {
        const fadeStart = totalArea - viewportHeight;
        const fadeEnd = totalArea;
        const fadePercent = 1 - (scrollY - fadeStart) / (viewportHeight);
        setOpacity(Math.max(fadePercent, 0));
      } else {
        setOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-0 bg-black transition-opacity duration-300"
      style={{ opacity }}
    >
      <Canvas
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 18], fov: 35 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#050505']} />
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          
          <Particles count={3500} scrollProgressRef={scrollRef} />
          <SpiralCarousel onProjectClick={onProjectClick} scrollProgressRef={scrollRef} />

          <Environment preset="night" />

          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.5} 
              mipmapBlur 
              intensity={1.2} 
              radius={0.4} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
