import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface CarouselItemProps {
  index: number;
  total: number;
  title: string;
  category: string;
  scrollProgressRef: React.MutableRefObject<number>;
  onClick: (x: number, y: number) => void;
}

export function CarouselItem({ index, total, title, category, scrollProgressRef, onClick }: CarouselItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Atualiza o cursor do mouse globalmente quando passa sobre um card
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  const lerpScroll = useRef(0);
  const { viewport } = useThree();
  const isMobile = viewport.width < 10;

  // Layout Constants adaptáveis
  const radius = isMobile ? 5.5 : 9; 
  const verticalSpacing = isMobile ? 4.5 : 7;
  const angleSpacing = isMobile ? Math.PI / 1.8 : Math.PI / 2.2; 

  const tilt = useMemo(() => (Math.random() - 0.5) * 0.05, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    lerpScroll.current = THREE.MathUtils.lerp(lerpScroll.current, scrollProgressRef.current, 0.08);
    const scroll = lerpScroll.current;

    const focus = scroll * (total - 1);
    const itemProgress = focus - index;
    
    const itemAngle = itemProgress * angleSpacing + Math.PI / 2;
    
    const x = Math.cos(itemAngle) * radius;
    const z = Math.sin(itemAngle) * radius;
    
    const y = itemProgress * verticalSpacing;

    // Ajuste Mobile: Reduzido para centralizar mais o conteúdo
    const verticalOffset = isMobile ? viewport.height * 0.05 : 0;
    
    meshRef.current.position.set(x, y + verticalOffset, z);
    meshRef.current.lookAt(0, y + verticalOffset, 0);
    meshRef.current.rotation.y += Math.PI;
    meshRef.current.rotation.z += tilt;

    const depthFactor = THREE.MathUtils.clamp((z + radius) / (radius * 2), 0, 1);
    const proximity = Math.exp(-Math.abs(itemProgress) * 0.5); 
    
    // Escala levemente maior no mobile para preencher o centro
    const baseScale = isMobile ? 1.7 : 1.5;
    const targetScale = THREE.MathUtils.lerp(0.3, baseScale, depthFactor) * (0.5 + 0.5 * proximity);
    const finalScale = hovered ? targetScale * 1.05 : targetScale;
    
    meshRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.1);
  });

  return (
    <group ref={meshRef}>
      {/* 16:9 Project Card */}
      <group>
        {/* Main Body */}
        <mesh 
          onPointerOver={() => setHovered(true)} 
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onClick(e.clientX, e.clientY);
          }}
        >
          <planeGeometry args={[4, 2.25]} />
          <meshStandardMaterial 
            color={hovered ? "#666" : "#444"}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? "#333" : "#111"}
            side={THREE.DoubleSide}
          />
          
          {/* Inner Wireframe for depth and "tech" look */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[3.9, 2.15]} />
            <meshBasicMaterial 
              color="#ffffff" 
              wireframe 
              transparent 
              opacity={0.2} 
              side={THREE.DoubleSide}
            />
          </mesh>
        </mesh>
      </group>
    </group>
  );
}
