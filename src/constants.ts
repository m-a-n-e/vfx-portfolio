export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  videoUrl?: string; // Placeholder for now
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'NEON DREAMS',
    category: 'Motion Graphics',
    description: 'A psychedelic journey through a digital cityscape.',
  },
  {
    id: '2',
    title: 'CYBERPUNK ERA',
    category: 'VFX Compositing',
    description: 'High-end compositing for a dystopian future.',
  },
  {
    id: '3',
    title: 'GLITCH IN THE MATRIX',
    category: 'Music Video',
    description: 'Experimental glitch effects for an indie artist.',
  },
  {
    id: '4',
    title: 'ABSTRACT VOIDS',
    category: '3D Simulation',
    description: 'Procedural particle simulations in 4K.',
  },
  {
    id: '5',
    title: 'RETRO FUTURE',
    category: 'Post-Production',
    description: 'VHS aesthetic and retro-futuristic vibes.',
  },
  {
    id: '6',
    title: 'KINETIC ENERGY',
    category: 'Commercial',
    description: 'Dynamic typography and fast-paced editing.',
  },
  {
    id: '7',
    title: 'SILENT HORIZON',
    category: 'Cinematic VFX',
    description: 'Matte painting and environment extensions.',
  },
  {
    id: '8',
    title: 'DIGITAL SURREALISM',
    category: 'Art Piece',
    description: 'Merging organic shapes with digital distortions.',
  }
];
