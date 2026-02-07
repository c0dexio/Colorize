
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ToolType, TOOLS } from '../types';

interface DrawingAreaProps {
  backgroundImage: string;
  color: string;
  tool: ToolType;
}

export const DrawingArea: React.FC<DrawingAreaProps & { onSaveRef: (ref: () => void) => void, onClearRef: (ref: () => void) => void }> = ({ backgroundImage, color, tool, onSaveRef, onClearRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas and handle Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      
      // Si la taille n'a pas changé de manière significative, on évite de tout recalculer
      if (Math.abs(canvas.width - rect.width * scale) < 1 && Math.abs(canvas.height - rect.height * scale) < 1) {
        return;
      }

      // Sauvegarde du contenu avant redimensionnement
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        contextRef.current = ctx;
        // Restauration du contenu (étiré pour remplir la nouvelle zone)
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / scale, tempCanvas.height / scale, 0, 0, rect.width, rect.height);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(resizeCanvas);
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initial call
    resizeCanvas();

    return () => resizeObserver.disconnect();
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      return {
        offsetX: (e as React.MouseEvent).clientX - rect.left,
        offsetY: (e as React.MouseEvent).clientY - rect.top
      };
    }
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = contextRef.current;
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    
    const config = TOOLS[tool];
    ctx.lineWidth = config.size;
    ctx.globalAlpha = config.opacity;
    
    if (tool === ToolType.ERASER) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }

    setIsDrawing(true);
  }, [color, tool]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = contextRef.current;
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    contextRef.current?.closePath();
    setIsDrawing(false);
  }, [isDrawing]);

  useEffect(() => {
    onClearRef(() => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }, [onClearRef]);

  useEffect(() => {
    onSaveRef(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;

      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.onload = () => {
        tCtx.fillStyle = 'white';
        tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        const scale = Math.min(tempCanvas.width / (bgImg.width || 1), tempCanvas.height / (bgImg.height || 1));
        const x = (tempCanvas.width - bgImg.width * scale) / 2;
        const y = (tempCanvas.height - bgImg.height * scale) / 2;
        tCtx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
        
        tCtx.globalCompositeOperation = 'multiply';
        tCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = `mon-coloriage-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      };
      bgImg.src = backgroundImage;
    });
  }, [backgroundImage, onSaveRef]);

  return (
    <div className="relative flex-1 min-w-0 min-h-0 bg-white rounded-3xl sm:rounded-[3rem] shadow-2xl overflow-hidden border-4 sm:border-8 border-yellow-200 w-full h-full">
      {/* Background image: dessin au trait */}
      <div 
        className="absolute inset-0 pointer-events-none bg-contain bg-center bg-no-repeat z-0 p-2 sm:p-4"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ mixBlendMode: 'multiply' }}
        className="relative z-10 w-full h-full cursor-crosshair touch-none"
      />
    </div>
  );
};
