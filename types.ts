import React from 'react';

export interface BuildingModel {
  id: string;
  name: string;
  description: string;
  src: string; // URL to GLB
  iosSrc?: string; // Optional URL to USDZ for faster iOS loading
  previewImage: string;
}

export interface ARSessionState {
  isActive: boolean;
  modelId: string | null;
}