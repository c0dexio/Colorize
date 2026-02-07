
import React from 'react';
import { COLORS } from '../types';

interface PaletteProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
}

export const Palette: React.FC<PaletteProps> = ({ currentColor, onSelectColor }) => {
  return (
    <div className="flex flex-row landscape:flex-col sm:flex-col gap-1.5 sm:gap-2 overflow-x-auto landscape:overflow-y-auto sm:overflow-y-auto bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl sm:rounded-[2.5rem] shadow-xl border-2 sm:border-4 border-yellow-300 max-h-[64px] landscape:max-h-[80vh] sm:max-h-[80vh] sm:w-16 md:w-20 no-scrollbar max-w-[95vw] sm:max-w-none">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition-all transform hover:scale-110 active:scale-90 shadow-sm ${
            currentColor === color ? 'border-gray-800 scale-115 ring-2 ring-yellow-400 z-10' : 'border-white/50'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Couleur ${color}`}
        />
      ))}
    </div>
  );
};
