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

  // Estabilização do elemento de vídeo
  const video = useMemo(() => {
    const v = document.createElement('video');
    v.src = '/rick.mp4';
    v.crossOrigin = 'Anonymous';
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    v.autoplay = true; // Força o início automático
    return v;
  }, []);

  const videoTexture = useMemo(() => {
    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.format = THREE.RGBAFormat;
    return tex;
  }, [video]);

  // Garante que o vídeo continue tocando
  useEffect(() => {
    const handlePlay = () => {
      video.play().catch(err => console.log("Erro ao tocar vídeo:", err));
    };

    handlePlay();

    // Tenta tocar novamente em caso de interação global se estiver pausado
    window.addEventListener('click', handlePlay, { once: true });
    window.addEventListener('touchstart', handlePlay, { once: true });

    return () => {
      window.removeEventListener('click', handlePlay);
      window.removeEventListener('touchstart', handlePlay);
    };
  }, [video]);

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

    // Garante que o Three.js saiba que a textura precisa ser atualizada
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      videoTexture.needsUpdate = true;
    }

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
            map={videoTexture}
            metalness={0.5}
            roughness={0.5}
            emissive={hovered ? "#333" : "#000"}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
