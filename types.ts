export type ItemType = 'room' | 'furniture' | 'structure';

export interface Hotspot {
  id: string;
  position: string; // "x y z" coordinates
  normal: string;   // "x y z" vector
  label: string;
  type: ItemType;
  dimensions?: string;
  description?: string;
}

export interface BuildingModel {
  id: string;
  name: string;
  description: string;
  src: string; // URL to GLB
  iosSrc?: string; // Optional URL to USDZ for faster iOS loading
  previewImage: string;
  hotspots?: Hotspot[];
}

export interface ARSessionState {
  isActive: boolean;
  modelId: string | null;
}
