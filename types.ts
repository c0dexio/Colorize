
export enum AppState {
  SELECTION = 'SELECTION',
  LOADING = 'LOADING',
  COLORING = 'COLORING'
}

export enum Theme {
  ANIMALS = 'Animaux',
  PRINCESSES = 'Princesses',
  BUILDINGS = 'Bâtiments',
  VEHICLES = 'Véhicules',
  DINOSAURS = 'Dinosaures',
  SPACE = 'Espace',
  ROBOTS = 'Robots',
  OCEAN = 'Sous l\'Océan'
}

export enum ToolType {
  PENCIL = 'PENCIL',
  MARKER = 'MARKER',
  BRUSH = 'BRUSH',
  ERASER = 'ERASER'
}

export interface ToolConfig {
  type: ToolType;
  size: number;
  opacity: number;
  icon: string;
  label: string;
}

export const TOOLS: Record<ToolType, ToolConfig> = {
  [ToolType.PENCIL]: { type: ToolType.PENCIL, size: 4, opacity: 1, icon: 'fa-pencil', label: 'Crayon' },
  [ToolType.MARKER]: { type: ToolType.MARKER, size: 12, opacity: 1, icon: 'fa-marker', label: 'Feutre' },
  [ToolType.BRUSH]: { type: ToolType.BRUSH, size: 24, opacity: 0.6, icon: 'fa-paint-brush', label: 'Pinceau' },
  [ToolType.ERASER]: { type: ToolType.ERASER, size: 40, opacity: 1, icon: 'fa-eraser', label: 'Gomme' },
};

export const COLORS = [
  '#FF0000', '#FF4500', '#FF7F00', '#FFA500', // Rouges et Oranges
  '#FFFF00', '#FFD700', '#ADFF2F', '#7FFF00', // Jaunes et Verts clairs
  '#00FF00', '#32CD32', '#008000', '#00FA9A', // Verts
  '#00FFFF', '#00CED1', '#00BFFF', '#1E90FF', // Cyans et Bleus ciel
  '#0000FF', '#00008B', '#4B0082', '#8B00FF', // Bleus profonds et Violets
  '#9932CC', '#FF00FF', '#FF1493', '#FFC0CB', // Magentas et Roses
  '#F5DEB3', '#8B4513', '#A0522D', '#000000', // Bruns et Noir
];
