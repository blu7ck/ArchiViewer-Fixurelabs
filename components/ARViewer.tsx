import React, { useRef, useState, useEffect } from 'react';
import { BuildingModel } from '../types';
import { RotateCcw, Camera, AlertTriangle, RefreshCw } from 'lucide-react';

interface ARViewerProps {
  model: BuildingModel;
  environmentImage?: string;
}

export const ARViewer: React.FC<ARViewerProps> = ({ model, environmentImage = 'neutral' }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const modelViewerRef = useRef<HTMLElement>(null);

  // Handle Model Viewer Events
  useEffect(() => {
    setLoading(true);
    setProgress(0);
    setError(null);
    
    const viewer = modelViewerRef.current;
    
    const handleProgress = (event: any) => {
      const p = event.detail.totalProgress;
      if (p !== undefined) setProgress(p * 100);
      if (p === 1) setLoading(false);
    };

    const handleLoad = () => {
      setLoading(false);
      setError(null);
    };

    const handleError = (event: any) => {
      // Log the specific error detail if available, otherwise the event itself
      const errorMsg = event.detail?.message || event.type || 'Unknown error';
      console.error('Model Viewer Error:', errorMsg, event);
      setLoading(false);
      setError('Failed to load 3D model resources.');
    };

    if (viewer) {
      viewer.addEventListener('progress', handleProgress);
      viewer.addEventListener('load', handleLoad);
      viewer.addEventListener('error', handleError);
    }
    
    return () => {
      if (viewer) {
        viewer.removeEventListener('progress', handleProgress);
        viewer.removeEventListener('load', handleLoad);
        viewer.removeEventListener('error', handleError);
      }
    };
  }, [model.src]);

  const takeScreenshot = async () => {
    const viewer = modelViewerRef.current as any;
    if (viewer) {
      try {
        const blob = await viewer.toBlob({ mimeType: 'image/png' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `snapshot-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Screenshot failed', err);
        alert('Could not capture screenshot. The 3D content might be protected or failed to load correctly.');
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden">
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-100 text-slate-600 p-4 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Network Error</h3>
          <p className="max-w-xs text-sm mb-6">{error}. Please check your connection or try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-black transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload App</span>
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && !error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">Loading Model</span>
        </div>
      )}

      {/* --- 3D VIEWPORT --- */}
      <model-viewer
        ref={modelViewerRef}
        src={model.src}
        ios-src={model.iosSrc} 
        alt={model.name}
        ar={true}
        ar-modes="scene-viewer webxr quick-look" 
        camera-controls={true}
        auto-rotate={false}
        autoplay={true} 
        animation-name="Run" // Default animation play
        interaction-prompt="none"
        shadow-intensity="1.5"
        environment-image={environmentImage}
        className="w-full h-full focus:outline-none"
      >
        <div slot="ar-prompt" className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
           Move device to find surface
        </div>
      </model-viewer>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="absolute bottom-8 left-4 right-4 z-20 flex justify-between items-end pointer-events-none">
         
         {/* Left: View Controls */}
         <div className="flex flex-col gap-2 pointer-events-auto">
             <button 
                onClick={takeScreenshot}
                className="w-12 h-12 bg-white text-slate-700 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                title="Screenshot"
             >
                <Camera className="w-5 h-5" />
             </button>
         </div>

         {/* Right: Reset */}
         <div className="pointer-events-auto">
            <button 
                onClick={() => {
                    const viewer = modelViewerRef.current as any;
                    if (viewer) {
                        viewer.cameraOrbit = '45deg 55deg 105%';
                        viewer.jumpCameraToGoal();
                    }
                }}
                className="w-12 h-12 bg-white text-slate-700 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
            >
                <RotateCcw className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
};
