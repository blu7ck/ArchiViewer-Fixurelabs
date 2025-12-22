import React, { useRef, useState, useEffect } from 'react';
import { BuildingModel } from '../types';
import { RotateCcw, Box, Smartphone } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'rotation-per-second'?: string;
        'interaction-prompt'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        'environment-image'?: string;
        exposure?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
      };
    }
  }
}

interface ARViewerProps {
  model: BuildingModel;
  onArActivate?: () => void;
}

export const ARViewer: React.FC<ARViewerProps> = ({ model, onArActivate }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const modelViewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    
    const viewer = modelViewerRef.current;
    
    const handleProgress = (event: any) => {
      const p = event.detail.totalProgress;
      if (p !== undefined) {
        setProgress(p * 100);
      }
      if (p === 1) {
        setLoading(false);
      }
    };

    const handleLoad = () => {
      setLoading(false);
    };

    if (viewer) {
      viewer.addEventListener('progress', handleProgress);
      viewer.addEventListener('load', handleLoad);
    }
    
    return () => {
      if (viewer) {
        viewer.removeEventListener('progress', handleProgress);
        viewer.removeEventListener('load', handleLoad);
      }
    };
  }, [model.src]);

  const activateAR = () => {
    const viewer = modelViewerRef.current as any;
    if (viewer?.activateAR) {
      viewer.activateAR();
      if (onArActivate) onArActivate();
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
          <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">Loading Asset</span>
          <span className="text-xs text-slate-400 mt-2">{Math.round(progress)}%</span>
        </div>
      )}

      {/* 
        Model Viewer Configuration:
        - ar: Enables AR
        - ar-modes: 'webxr', 'scene-viewer', 'quick-look'
        - camera-controls: Enables mouse/touch interaction (rotate, zoom, pan)
        - disable-pan: false (default) allows two-finger panning
        - ar-placement="floor": Anchors to detected planes
      */}
      <model-viewer
        ref={modelViewerRef}
        src={model.src}
        ios-src={model.iosSrc || ''}
        alt={`3D model of ${model.name}`}
        ar={true}
        ar-modes="webxr scene-viewer quick-look"
        camera-controls={true}
        auto-rotate={true}
        rotation-per-second="30deg" 
        interaction-prompt="auto"
        ar-scale="auto"
        ar-placement="floor"
        shadow-intensity="1.2"
        shadow-softness="1"
        environment-image="neutral"
        exposure="1.2"
        className="w-full h-full focus:outline-none"
      >
        <div slot="ar-button" className="hidden"></div>
      </model-viewer>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button 
          onClick={activateAR}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 group"
        >
          <Box className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>View in Room</span>
        </button>

        <button 
          onClick={() => {
            const viewer = modelViewerRef.current as any;
            viewer.cameraOrbit = '45deg 55deg 105%';
            viewer.jumpCameraToGoal();
          }}
          className="p-3 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 rounded-full shadow-lg border border-white/20 transition-all active:scale-95"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};