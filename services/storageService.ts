
import { Project, BlogPost, StudioSettings, PhilosophyAxiom } from '../types';
import { PROJECTS as INITIAL_PROJECTS, FIRM_BIO, PHONE_NUMBER, LOCATION_DETAIL } from '../constants';

const PROJECTS_KEY = 'yz_architect_projects';
const POSTS_KEY = 'yz_architect_posts';
const SETTINGS_KEY = 'yz_architect_settings';
const PHILOSOPHY_KEY = 'yz_architect_philosophy';

const INITIAL_SETTINGS: StudioSettings = {
  firmName: "YZ ARCHITECTE",
  firmSub: "Settat • Maroc",
  bio: FIRM_BIO,
  visionTitle: "Ancrer la Modernité",
  visionSub: "Vision Architecturale",
  location: LOCATION_DETAIL,
  phone: PHONE_NUMBER,
  whatsapp: "https://wa.me/212774258740",
  instagram: "@yz.architecte",
  manifestoHero: "Régionalisme Critique",
  manifestoSub: "Une architecture qui s'oppose à l'optimisation technologique universelle par une attention portée au lieu, à la lumière et à la culture tectonique."
};

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'La Terre comme Manifeste',
    date: '12 Mars 2024',
    category: 'Pensée',
    excerpt: 'Pourquoi le retour aux matériaux vernaculaires n\'est pas un retour en arrière, mais un acte de résistance technologique.',
    imageUrl: 'https://images.unsplash.com/photo-1518005020481-a68515605041?q=80&w=1200',
    content: [
      { type: 'p', value: "Dans le plateau de la Chaouia, la terre n'est pas qu'un sol, c'est un langage. En utilisant la pierre de Ben Ahmed, nous ne faisons pas que construire un mur; nous prolongeons une conversation géologique interrompue par le modernisme générique." },
      { type: 'h2', value: "La Tectonique du Lieu" },
      { type: 'p', value: "L'architecture doit être une réponse directe aux forces climatiques. Le vent, la chaleur et l'ombre sont nos premiers matériaux de construction." },
      { type: 'quote', value: "L'architecture ne doit pas simplement occuper l'espace, elle doit le justifier." }
    ]
  }
];

const INITIAL_PHILOSOPHY: PhilosophyAxiom[] = [
  {
    id: '1',
    subtitle: 'Axiome I',
    title: 'Ancrage Territorial',
    text: "À Settat, nous travaillons avec le sol de la Chaouia. Nos fondations ne sont pas de simples supports, elles sont une négociation avec la topographie locale.",
    imageUrl: 'https://images.unsplash.com/photo-1518005020481-a68515605041?q=80&w=800'
  }
];

const getStored = <T>(key: string, initial: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return initial;
  }
};

const dispatchRefresh = () => {
  window.dispatchEvent(new Event('storage'));
};

export const getSettings = (): StudioSettings => getStored(SETTINGS_KEY, INITIAL_SETTINGS);
export const saveSettings = (s: StudioSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  dispatchRefresh();
};

export const getAxioms = (): PhilosophyAxiom[] => getStored(PHILOSOPHY_KEY, INITIAL_PHILOSOPHY);
export const saveAxioms = (a: PhilosophyAxiom[]) => {
  localStorage.setItem(PHILOSOPHY_KEY, JSON.stringify(a));
  dispatchRefresh();
};

export const getProjects = (): Project[] => getStored(PROJECTS_KEY, INITIAL_PROJECTS);
export const saveProject = (project: Partial<Project>): Project[] => {
  const projects = getProjects();
  let updated: Project[];
  if (project.id) {
    updated = projects.map(p => p.id === project.id ? { ...p, ...project } as Project : p);
  } else {
    const newProject = { 
      ...project, 
      id: Date.now().toString(),
      gallery: project.gallery || [],
      features: project.features || []
    } as Project;
    updated = [...projects, newProject];
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  dispatchRefresh();
  return updated;
};

export const deleteProject = (id: string): Project[] => {
  const updated = getProjects().filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  dispatchRefresh();
  return updated;
};

export const getPosts = (): BlogPost[] => getStored(POSTS_KEY, INITIAL_POSTS);

export const savePost = (post: Partial<BlogPost>): BlogPost[] => {
  const posts = getPosts();
  let updated: BlogPost[];
  
  if (post.id) {
    updated = posts.map(p => {
      if (p.id === post.id) {
        return { 
          ...p, 
          ...post, 
          content: post.content || p.content || [] 
        } as BlogPost;
      }
      return p;
    });
  } else {
    const newPost = { 
      ...post, 
      id: Date.now().toString(), 
      content: post.content || [],
      imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1200',
      category: post.category || 'Pensée',
      date: post.date || new Date().toLocaleDateString('fr-FR')
    } as BlogPost;
    updated = [newPost, ...posts];
  }
  
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatchRefresh();
  return updated;
};

export const deletePost = (id: string): BlogPost[] => {
  const updated = getPosts().filter(p => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  dispatchRefresh();
  return updated;
};

export const getProjectById = (id: string): Project | undefined => getProjects().find(p => p.id === id);
export const getPostById = (id: string): BlogPost | undefined => getPosts().find(p => p.id === id);
