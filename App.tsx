
import React, { useState, useRef } from 'react';
import { AppState, Theme, ToolType, COLORS } from './types';
import { ThemeSelector } from './components/ThemeSelector';
import { Palette } from './components/Palette';
import { Toolbox } from './components/Toolbox';
import { DrawingArea } from './components/DrawingArea';
import { ParentalGate } from './components/ParentalGate';
import { generateColoringPage } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SELECTION);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0]);
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.MARKER);
  
  const [isInitialVerified, setIsInitialVerified] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [gateAction, setGateAction] = useState<() => void>(() => {});

  const saveActionRef = useRef<() => void>(() => {});
  const clearActionRef = useRef<() => void>(() => {});

  const handleThemeSelect = async (theme: Theme) => {
    setCurrentTheme(theme);
    setState(AppState.LOADING);
    
    try {
      const imageUrl = await generateColoringPage(theme);
      setBackgroundImage(imageUrl);
      setState(AppState.COLORING);
    } catch (err) {
      console.error(err);
      setState(AppState.SELECTION);
    }
  };

  const performRegeneration = async () => {
    if (currentTheme) {
      if (clearActionRef.current) clearActionRef.current();
      setBackgroundImage(''); 
      setState(AppState.LOADING);
      try {
        const imageUrl = await generateColoringPage(currentTheme);
        setBackgroundImage(imageUrl);
        setState(AppState.COLORING);
      } catch (err) {
        console.error(err);
        setState(AppState.SELECTION);
      }
    }
  };

  const handleRegenerateRequest = () => {
    setGateAction(() => performRegeneration);
    setShowGate(true);
  };

  const handleBack = () => {
    setState(AppState.SELECTION);
    setBackgroundImage('');
    setCurrentTheme(null);
  };

  if (!isInitialVerified) {
    return (
      <ParentalGate 
        title="Espace Parent" 
        onSuccess={() => setIsInitialVerified(true)} 
      />
    );
  }

  if (state === AppState.SELECTION) {
    return <ThemeSelector onSelect={handleThemeSelect} />;
  }

  if (state === AppState.LOADING) {
    return (
      <div className="h-screen w-full bg-blue-100 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 md:w-24 md:h-24 border-8 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl md:text-4xl font-bold text-blue-600 animate-pulse text-center">
          Création de ton coloriage...
        </h2>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col landscape:flex-row bg-yellow-50 overflow-hidden relative p-2 md:p-4 gap-2 md:gap-4">
      {/* Overlay pour suggérer le mode paysage si l'écran est trop étroit verticalement */}
      <div className="fixed inset-0 z-[60] bg-blue-600 flex flex-col items-center justify-center p-8 text-white text-center sm:hidden portrait:flex">
        <i className="fas fa-mobile-alt text-6xl mb-6 animate-bounce" style={{ transform: 'rotate(90deg)' }}></i>
        <h2 className="text-2xl font-bold mb-2">Tourne ton téléphone !</h2>
        <p>Le coloriage est bien plus amusant en mode paysage.</p>
      </div>

      {showGate && (
        <ParentalGate 
          onSuccess={() => {
            setShowGate(false);
            gateAction();
          }} 
          onCancel={() => setShowGate(false)}
        />
      )}

      {/* Toolbox: À gauche en mode paysage */}
      <div className="flex flex-row landscape:flex-col justify-center items-center z-20 flex-shrink-0">
        <Toolbox 
          currentTool={currentTool} 
          onSelectTool={setCurrentTool} 
          onClear={() => clearActionRef.current()} 
          onSave={() => saveActionRef.current()}
          onBack={handleBack}
          onRegenerate={handleRegenerateRequest}
        />
      </div>

      {/* Zone de dessin: Doit avoir min-w-0 pour empêcher le débordement horizontal */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        <DrawingArea 
          backgroundImage={backgroundImage}
          color={currentColor}
          tool={currentTool}
          onSaveRef={(ref) => saveActionRef.current = ref}
          onClearRef={(ref) => clearActionRef.current = ref}
        />
      </div>

      {/* Palette: À droite en mode paysage */}
      <div className="flex flex-row landscape:flex-col justify-center items-center z-20 flex-shrink-0">
        <Palette 
          currentColor={currentColor} 
          onSelectColor={(color) => {
            setCurrentColor(color);
            if (currentTool === ToolType.ERASER) {
              setCurrentTool(ToolType.MARKER);
            }
          }} 
        />
      </div>
    </div>
  );
};

export default App;
