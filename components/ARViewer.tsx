import React, { useRef, useState, useEffect } from 'react';
import { BuildingModel, Floor, Hotspot } from '../types';
import { RotateCcw, Camera, AlertTriangle, RefreshCw, Lock, Unlock, Box, Info, Layers, Hand } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-placement'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        'disable-pan'?: boolean;
        'touch-action'?: string;
        'auto-rotate'?: boolean;
        autoplay?: boolean;
        'animation-name'?: string;
        'interaction-prompt'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        'environment-image'?: string;
        [key: string]: any;
      };
    }
  }
}

interface ARViewerProps {
  model: BuildingModel;
  environmentImage?: string;
}

export const ARViewer: React.FC<ARViewerProps> = ({ model, environmentImage = 'neutral' }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // States
  const [isLocked, setIsLocked] = useState(false); // AR Lock State
  const [arStatus, setArStatus] = useState<string>('not-presenting');
  const [activeFloor, setActiveFloor] = useState<Floor | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const modelViewerRef = useRef<HTMLElement>(null);

  // Set initial floor when model changes
  useEffect(() => {
    if (model.floors && model.floors.length > 0) {
      setActiveFloor(model.floors[0]);
    } else {
      setActiveFloor(null);
    }
    setActiveHotspot(null);
  }, [model.id]);

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
      const errorMsg = event.detail?.message || event.type || 'Unknown error';
      console.error('Model Viewer Error:', errorMsg, event);
      setLoading(false);
      setError('Failed to load 3D model resources.');
    };

    const handleARStatus = (event: any) => {
      // status can be: 'not-presenting', 'session-started', 'object-placed', 'presenting'
      setArStatus(event.detail.status);
    };

    if (viewer) {
      viewer.addEventListener('progress', handleProgress);
      viewer.addEventListener('load', handleLoad);
      viewer.addEventListener('error', handleError);
      viewer.addEventListener('ar-status', handleARStatus);
    }
    
    return () => {
      if (viewer) {
        viewer.removeEventListener('progress', handleProgress);
        viewer.removeEventListener('load', handleLoad);
        viewer.removeEventListener('error', handleError);
        viewer.removeEventListener('ar-status', handleARStatus);
      }
    };
  }, [model.src]);

  // Handle Floor Change
  const handleFloorChange = (floor: Floor) => {
    setActiveFloor(floor);
    const viewer = modelViewerRef.current as any;
    if (viewer) {
      viewer.cameraTarget = floor.cameraTarget;
    }
  };

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

  const isARActive = arStatus === 'presenting' || arStatus === 'session-started' || arStatus === 'object-placed';

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
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm pointer-events-none">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">Loading Model</span>
        </div>
      )}

      {/* --- 3D VIEWPORT --- */}
      {/* @ts-ignore */}
      <model-viewer
        ref={modelViewerRef}
        src={model.src}
        ios-src={model.iosSrc} 
        alt={model.name}
        ar={true}
        // ar-modes: prioritizing webxr allows DOM overlay (custom buttons in AR) on Android
        ar-modes="webxr scene-viewer quick-look" 
        ar-placement="floor"
        ar-scale={isLocked ? "fixed" : "auto"}
        camera-controls={true} 
        disable-pan={isLocked}
        touch-action="pan-y"
        auto-rotate={false}
        autoplay={true} 
        animation-name="Run"
        interaction-prompt="auto"
        shadow-intensity="1.5"
        shadow-softness="1"
        environment-image={environmentImage}
        className="w-full h-full focus:outline-none"
      >
        {/* --- CUSTOM HOTSPOTS --- */}
        {model.hotspots?.map((hotspot) => (
          <button
            key={hotspot.id}
            slot={`hotspot-${hotspot.id}`}
            data-position={hotspot.position}
            data-normal={hotspot.normal}
            onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
            className={`group relative flex items-center justify-center transition-all duration-300 ease-out ${
              activeHotspot === hotspot.id ? 'z-50' : 'z-10'
            }`}
          >
            {/* Dot */}
            <div className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-colors ${
              activeHotspot === hotspot.id ? 'bg-indigo-600 scale-110' : 'bg-indigo-500/80 hover:bg-indigo-600'
            }`}>
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            
            {/* Pulse Effect */}
            {!activeHotspot && (
               <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-75"></div>
            )}

            {/* Tooltip Card */}
            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl p-3 text-left pointer-events-none transition-all duration-200 origin-bottom ${
              activeHotspot === hotspot.id 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-90 translate-y-2'
            }`}>
               <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{hotspot.type}</div>
               <div className="font-bold text-slate-800 text-sm mb-1">{hotspot.label}</div>
               {hotspot.description && (
                 <div className="text-xs text-slate-500 leading-relaxed">{hotspot.description}</div>
               )}
               {/* Arrow */}
               <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
            </div>
          </button>
        ))}

        {/* --- AR SPECIFIC SLOTS --- */}
        <div slot="ar-button" style={{ display: 'none' }}></div>
        
        {/* Custom AR Prompt (Hand Gesture) */}
        <div slot="ar-prompt" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
           <div className="flex flex-col items-center animate-pulse">
              <Hand className="w-16 h-16 text-white drop-shadow-lg" />
              <div className="mt-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-medium">
                 Move device to find floor
              </div>
           </div>
        </div>

      </model-viewer>

      {/* --- AR MODE OVERLAY (WebXR Only) --- */}
      {isARActive && (
         <div className="absolute top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
            {/* AR Lock Button - Only visible in AR mode */}
            <button 
                onClick={(e) => {
                   e.stopPropagation(); // Prevent model-viewer click
                   setIsLocked(!isLocked);
                }}
                className={`pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 ${
                  isLocked 
                    ? 'bg-green-500 text-white border-2 border-green-400' 
                    : 'bg-white/90 text-slate-800 border-2 border-white'
                }`}
            >
                {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                <span className="font-bold tracking-wide">{isLocked ? 'Position Locked' : 'Tap to Lock'}</span>
            </button>
         </div>
      )}

      {/* --- FLOOR SELECTOR (Right Side) --- */}
      {model.floors && model.floors.length > 1 && !isARActive && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur rounded-2xl p-1.5 shadow-lg border border-white/40">
           <div className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest py-1">Floors</div>
           {model.floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => handleFloorChange(floor)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeFloor?.id === floor.id 
                    ? 'bg-indigo-600 text-white shadow-md scale-110' 
                    : 'bg-transparent text-slate-500 hover:bg-indigo-50'
                }`}
                title={floor.name}
              >
                {activeFloor?.id === floor.id ? <Layers className="w-5 h-5" /> : <span className="text-sm font-bold">{floor.id.toUpperCase().substring(0,2)}</span>}
              </button>
           ))}
        </div>
      )}

      {/* --- BOTTOM CONTROLS (Standard View) --- */}
      {!isARActive && (
        <div className="absolute bottom-8 left-4 right-4 z-20 flex justify-between items-end pointer-events-none">
           
           {/* Left: Screenshot */}
           <div className="flex flex-col gap-2 pointer-events-auto">
               <button 
                  onClick={takeScreenshot}
                  className="w-12 h-12 bg-white text-slate-700 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                  title="Screenshot"
               >
                  <Camera className="w-5 h-5" />
               </button>
           </div>
  
           {/* Right: Tools Stack */}
           <div className="flex flex-col gap-3 pointer-events-auto">
              
              {/* View in AR (Primary Action) */}
              <button 
                  onClick={() => {
                    const viewer = modelViewerRef.current as any;
                    if (viewer) viewer.activateAR();
                  }}
                  className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 hover:bg-indigo-700 active:scale-95 transition-all animate-bounce-subtle"
                  title="View in AR"
              >
                  <Box className="w-6 h-6" />
              </button>
  
              {/* Reset */}
              <button 
                  onClick={() => {
                      const viewer = modelViewerRef.current as any;
                      if (viewer) {
                          viewer.cameraOrbit = '45deg 55deg 105%';
                          viewer.jumpCameraToGoal();
                          if (model.floors && model.floors.length > 0) handleFloorChange(model.floors[0]);
                      }
                  }}
                  className="w-12 h-12 bg-white text-slate-700 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                  title="Reset View"
              >
                  <RotateCcw className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};