
import React from 'react';
import { Theme } from '../types';

interface ThemeSelectorProps {
  onSelect: (theme: Theme) => void;
}

const ThemeCard: React.FC<{ theme: Theme; icon: string; color: string; onClick: () => void }> = ({ theme, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} hover:scale-105 transition-all duration-300 rounded-[2rem] p-4 sm:p-6 flex flex-col items-center justify-center shadow-xl border-b-8 border-black/20 active:scale-95 group relative overflow-hidden`}
  >
    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="text-5xl sm:text-7xl mb-2 sm:mb-4 transform group-hover:rotate-12 transition-transform">{icon}</div>
    <span className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider text-center drop-shadow-sm">{theme}</span>
  </button>
);

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelect }) => {
  const themes = [
    { theme: Theme.ANIMALS, icon: "🦁", color: "bg-orange-400" },
    { theme: Theme.PRINCESSES, icon: "👑", color: "bg-pink-400" },
    { theme: Theme.DINOSAURS, icon: "🦖", color: "bg-green-500" },
    { theme: Theme.SPACE, icon: "🚀", color: "bg-indigo-500" },
    { theme: Theme.VEHICLES, icon: "🚗", color: "bg-blue-400" },
    { theme: Theme.ROBOTS, icon: "🤖", color: "bg-slate-400" },
    { theme: Theme.OCEAN, icon: "🐳", color: "bg-cyan-500" },
    { theme: Theme.BUILDINGS, icon: "🏠", color: "bg-emerald-400" },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center p-4 sm:p-8 bg-blue-100 overflow-y-auto no-scrollbar">
      <h1 className="text-3xl sm:text-5xl md:text-6xl text-blue-600 my-6 sm:my-10 text-center drop-shadow-md">
        Choisis ton dessin !
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 max-w-6xl w-full pb-10">
        {themes.map((t) => (
          <ThemeCard key={t.theme} {...t} onClick={() => onSelect(t.theme)} />
        ))}
      </div>
    </div>
  );
};
