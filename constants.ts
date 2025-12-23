import { BuildingModel } from './types';

// We are using the Astronaut model as a proxy for a 2-story building.
// The "Visor/Head" represents the 2nd Floor (Penthouse).
// The "Body/Backpack" represents the 1st Floor (Living Area).

export const SAMPLE_MODELS: BuildingModel[] = [
  {
    id: 'apt-complex-01',
    name: 'Dublex Apartment',
    description: 'Modern 2-story unit with open plan living.',
    src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    iosSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
    previewImage: 'https://picsum.photos/id/188/400/300',
    hotspots: []
  },
  {
    id: 'studio-01',
    name: 'Compact Studio',
    description: 'Efficient studio layout optimization.',
    src: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    iosSrc: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.usdz',
    previewImage: 'https://picsum.photos/id/237/400/300',
    hotspots: []
  },
  {
    id: 'garden-villa',
    name: 'Garden Villa & Surroundings',
    description: 'Animated scene: A detached house with a water fountain, passing pedestrians, a cat, and moving traffic.',
    // Using RobotExpressive again as a reliable placeholder for an animated GLB since ToyCar was not found.
    // In a real production scenario, this URL would point to the custom "Garden House" GLB file.
    src: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    iosSrc: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.usdz',
    previewImage: 'https://picsum.photos/id/10/400/300',
    hotspots: []
  }
];