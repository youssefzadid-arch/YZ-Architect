
export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Cultural' | 'Industrial';
  location: string;
  year: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  features: string[];
}

export type BlockType = 'p' | 'h2' | 'quote' | 'img';

export interface ContentBlock {
  type: BlockType;
  value: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: 'Pensée' | 'Chantier' | 'Recherche' | 'Matière';
  excerpt: string;
  content: ContentBlock[];
  imageUrl: string;
}

export interface PhilosophyAxiom {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  imageUrl: string;
}

export interface StudioSettings {
  firmName: string;
  firmSub: string;
  bio: string;
  visionTitle: string;
  visionSub: string;
  location: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  manifestoHero: string;
  manifestoSub: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
