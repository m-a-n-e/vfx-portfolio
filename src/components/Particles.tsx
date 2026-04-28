import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  scrollProgressRef: React.MutableRefObject<number>;
}

export function Particles({ count = 3500, scrollProgressRef }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const lerpScroll = useRef(0);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3 + 0] = (Math.random() - 0.5) * 80;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 80;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      // Suavização do scroll para as partículas
      lerpScroll.current = THREE.MathUtils.lerp(lerpScroll.current, scrollProgressRef.current, 0.08);
      
      // Rotação sincronizada com o carrossel
      // O multiplicador ajusta a "velocidade" da rotação em relação ao scroll
      const rotationSpeed = Math.PI * 4; 
      mesh.current.rotation.y = lerpScroll.current * rotationSpeed;
      
      // Pequeno movimento autônomo residual para não parecer estático quando parado
      mesh.current.rotation.y += state.clock.elapsedTime * 0.01;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation={true}
        color="#ffffff"
        transparent
        opacity={0.2}
        fog={false}
      />
    </points>
  );
}
