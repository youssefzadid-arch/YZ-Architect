
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'La Tectonique de la Chaouia',
    category: 'Residential',
    location: 'Settat, Maroc',
    year: '2024',
    description: 'Une résidence sculptée dans la pente, utilisant la pierre locale de Ben Ahmed pour créer une inertie thermique naturelle face au climat semi-aride de Settat.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    // Fix: Added missing gallery property as required by Project interface
    gallery: [],
    features: ['Pierre de Ben Ahmed brute', 'Ventilation transversale', 'Récupération des eaux de pluie']
  },
  {
    id: '2',
    title: 'L\'Espace Municipalité',
    category: 'Cultural',
    location: 'Settat, Maroc (Près de la Municipalité)',
    year: '2023',
    description: 'Un pavillon public qui réinterprète le moucharabieh traditionnel par une grille de béton géométrique, filtrant la lumière intense du plateau de Settat.',
    imageUrl: 'https://images.unsplash.com/photo-1518005020481-a68515605041?q=80&w=1200&auto=format&fit=crop',
    // Fix: Added missing gallery property as required by Project interface
    gallery: [],
    features: ['Béton banché apparent', 'Patios bioclimatiques', 'Toiture jardin']
  }
];

export const FIRM_BIO = "YZ Architecte pratique un Régionalisme Critique à Settat. Nous rejetons l'uniformité du verre mondial pour une architecture ancrée dans la terre de la Chaouia, la lumière du plateau et la culture tectonique locale.";
export const PHONE_NUMBER = "+212 7 74 25 87 40";
export const WHATSAPP_LINK = "https://wa.me/212774258740";
export const LOCATION_DETAIL = "Settat, à côté du bâtiment de la Municipalité";
