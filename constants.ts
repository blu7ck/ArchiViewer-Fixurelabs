import { BuildingModel } from './types';

// Using high-quality reliable models for demonstration. 
// In a real scenario, these would be the user's specific GLB architecture files.
// We use the Astronaut as a placeholder for "Building" because it is a known good GLB that works universally for testing AR logic.
// For the second model, we use a damaged helmet which has complex textures.

export const SAMPLE_MODELS: BuildingModel[] = [
  {
    id: 'bldg-001',
    name: 'Modern Office Complex',
    description: 'A multi-story commercial building with glass facade. Features open-plan interiors and rooftop garden access.',
    // Using a reliable GLB from Google's model-viewer assets for stability
    src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    previewImage: 'https://picsum.photos/id/1/400/300',
  },
  {
    id: 'bldg-002',
    name: 'Historical Villa Restoration',
    description: '19th-century villa digital twin. Showing proposed restoration of the eastern wing and landscape integration.',
    src: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    previewImage: 'https://picsum.photos/id/12/400/300',
  }
];
