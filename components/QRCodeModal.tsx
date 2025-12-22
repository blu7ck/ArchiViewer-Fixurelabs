import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, isOpen, onClose, modelName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Smartphone className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">View in Augmented Reality</h3>
          <p className="text-gray-500 text-sm mb-6">
            Scan this QR code with your iOS or Android device to view <strong>{modelName}</strong> in your physical space.
          </p>

          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-6">
            <QRCodeSVG 
              value={url} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-xs text-gray-400 max-w-xs">
            Make sure you are in a well-lit room. Point your camera at the floor to place the model.
          </div>
        </div>
      </div>
    </div>
  );
};
