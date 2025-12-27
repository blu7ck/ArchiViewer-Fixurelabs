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
    floors: [
      { id: 'f1', name: 'Ground Floor', cameraTarget: '0m 0.5m 0m' },
      { id: 'f2', name: 'Penthouse', cameraTarget: '0m 1.5m 0m' }
    ],
    hotspots: [
      {
        id: 'visor',
        position: '0m 1.7m 0.3m',
        normal: '0m 0m 1m',
        label: 'Master Bedroom',
        type: 'room',
        description: 'Panoramic view with smart glass technology.'
      },
      {
        id: 'backpack',
        position: '0m 1m -0.5m',
        normal: '0m 0m -1m',
        label: 'HVAC Unit',
        type: 'structure',
        description: 'High-efficiency climate control system.'
      }
    ]
  },
  {
    id: 'studio-01',
    name: 'Compact Studio',
    description: 'Efficient studio layout optimization.',
    src: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    iosSrc: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.usdz',
    previewImage: 'https://picsum.photos/id/237/400/300',
    floors: [
       { id: 'main', name: 'Main Level', cameraTarget: '0m 1m 0m' }
    ],
    hotspots: [
      {
        id: 'joint',
        position: '0m 0.8m 0m',
        normal: '-1m 0m 0m',
        label: 'Main Joint',
        type: 'structure',
        description: 'Reinforced steel connection.'
      }
    ]
  },
  {
    id: 'garden-villa',
    name: 'Garden Villa',
    description: 'Animated scene with surrounding environment.',
    src: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    iosSrc: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.usdz',
    previewImage: 'https://picsum.photos/id/10/400/300',
    floors: [
      { id: 'g', name: 'Garden', cameraTarget: '0m 0.5m 0m' },
      { id: 'r', name: 'Roof', cameraTarget: '0m 2m 0m' }
    ],
    hotspots: []
  }
];