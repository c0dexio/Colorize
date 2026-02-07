
import React from 'react';
import { ToolType, TOOLS, ToolConfig } from '../types';

interface ToolboxProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onClear: () => void;
  onSave: () => void;
  onBack: () => void;
  onRegenerate: () => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ currentTool, onSelectTool, onClear, onSave, onBack, onRegenerate }) => {
  return (
    <div className="flex landscape:flex-col sm:flex-col gap-1.5 sm:gap-3 bg-white/95 backdrop-blur-md p-1.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-blue-400 overflow-x-auto landscape:overflow-y-auto sm:overflow-y-auto no-scrollbar max-w-[95vw] sm:max-w-none">
      <button
        onClick={onBack}
        className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-700 hover:bg-gray-300 shadow transition-all active:scale-90 flex-shrink-0"
        title="Retour"
      >
        <i className="fas fa-arrow-left text-lg sm:text-xl"></i>
      </button>

      <div className="hidden landscape:block sm:block w-full h-px bg-gray-200 my-1 opacity-50"></div>

      {Object.values(TOOLS).map((tool: ToolConfig) => (
        <button
          key={tool.type}
          onClick={() => onSelectTool(tool.type)}
          className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0 ${
            currentTool === tool.type 
              ? 'bg-blue-500 text-white scale-110 shadow-lg ring-2 ring-blue-200' 
              : 'bg-white text-blue-500 hover:bg-blue-50 shadow-sm border border-blue-100'
          }`}
          title={tool.label}
        >
          <i className={`fas ${tool.icon} text-lg sm:text-xl`}></i>
        </button>
      ))}

      <div className="hidden landscape:block sm:block w-full h-px bg-gray-200 my-1 opacity-50"></div>

      <button
        onClick={onRegenerate}
        className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-400 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-purple-500 shadow transition-all active:scale-90 flex-shrink-0"
        title="Nouveau dessin"
      >
        <i className="fas fa-sync-alt text-lg sm:text-xl"></i>
      </button>

      <button
        onClick={onClear}
        className="w-10 h-10 sm:w-14 sm:h-14 bg-red-400 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-red-500 shadow transition-all active:scale-90 flex-shrink-0"
        title="Effacer tout"
      >
        <i className="fas fa-trash-alt text-lg sm:text-xl"></i>
      </button>

      <button
        onClick={onSave}
        className="w-10 h-10 sm:w-14 sm:h-14 bg-green-400 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-green-500 shadow transition-all active:scale-90 flex-shrink-0"
        title="Enregistrer"
      >
        <i className="fas fa-save text-lg sm:text-xl"></i>
      </button>
    </div>
  );
};
