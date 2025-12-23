import React, { useState, useEffect } from 'react';
import { ARViewer } from './components/ARViewer';
import { QRCodeModal } from './components/QRCodeModal';
import { SAMPLE_MODELS } from './constants';
import { BuildingModel } from './types';
import { Scan, Cuboid, ChevronRight, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<BuildingModel>(SAMPLE_MODELS[0]);
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div className="h-full w-full relative bg-slate-100 overflow-hidden font-sans text-slate-900">
      
      {/* 1. Main Viewer Layer */}
      <div className="absolute inset-0 z-0">
        <ARViewer 
          model={selectedModel} 
        />
      </div>

      {/* 2. Top Navigation Overlay */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Brand */}
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/20 flex items-center gap-2">
            <Cuboid className="w-5 h-5 text-indigo-600" />
            <h1 className="text-sm font-bold tracking-tight text-slate-800">
              ArchiView <span className="text-indigo-600">AR</span>
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md border border-white/20"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Connect Mobile</span>
            </button>
            
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-700"
            >
              {isSidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Sidebar / Model Selector Overlay */}
      <div className={`absolute top-20 left-4 bottom-8 w-80 max-w-[calc(100vw-32px)] z-20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
        <div className="h-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl flex flex-col overflow-hidden">
          
          {/* Sidebar Header */}
          <div className="p-6 pb-2">
             <h2 className="text-xl font-bold text-slate-800">Projects</h2>
             <p className="text-xs text-slate-500 mt-1">Select a model to visualize</p>
          </div>

          {/* Model List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {SAMPLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full group text-left p-3 rounded-2xl transition-all flex items-center gap-3 border ${
                    selectedModel.id === model.id 
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-white/50 hover:border-white'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 relative shadow-inner">
                     <img src={model.previewImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className={`font-semibold text-sm truncate ${selectedModel.id === model.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {model.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5 opacity-80">{model.description}</div>
                  </div>
                  {selectedModel.id === model.id && (
                    <ChevronRight className="w-4 h-4 text-indigo-500" />
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRCodeModal 
        isOpen={showQR} 
        onClose={() => setShowQR(false)} 
        url={currentUrl} 
        modelName={selectedModel.name}
      />
    </div>
  );
};

export default App;