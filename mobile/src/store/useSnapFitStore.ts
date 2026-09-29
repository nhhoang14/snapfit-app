import { create } from 'zustand';
import { ReferencePhoto, RealtimeAlignmentFeedback, CapturedPhoto, ComparisonResult } from '@/types';
import { MOCK_REFERENCES } from '@/services/mockData';

export type OverlayMode = 'both' | 'ghost' | 'skeleton' | 'grid' | 'none';

interface SnapFitState {
  // Reference Selection
  selectedReference: ReferencePhoto | null;
  activeCategory: string;
  setSelectedReference: (ref: ReferencePhoto | null) => void;
  setActiveCategory: (catId: string) => void;

  // Camera & Overlay Settings
  ghostOpacity: number;
  overlayMode: OverlayMode;
  showGrid: boolean;
  cameraFacing: 'back' | 'front';
  setGhostOpacity: (opacity: number) => void;
  setOverlayMode: (mode: OverlayMode) => void;
  toggleGrid: () => void;
  toggleCameraFacing: () => void;

  // Realtime Alignment
  alignmentFeedback: RealtimeAlignmentFeedback;
  setAlignmentFeedback: (feedback: RealtimeAlignmentFeedback) => void;

  // Captured Photos & Comparison
  capturedPhotos: CapturedPhoto[];
  activeComparison: {
    photo: CapturedPhoto;
    reference: ReferencePhoto | null;
    result: ComparisonResult | null;
  } | null;
  selectedFilter: string;
  addCapturedPhoto: (photo: CapturedPhoto) => void;
  setActiveComparison: (photo: CapturedPhoto, reference: ReferencePhoto | null, result?: ComparisonResult | null) => void;
  setSelectedFilter: (filterId: string) => void;
}

export const useSnapFitStore = create<SnapFitState>((set) => ({
  // Default with first portrait reference selected for immediate guidance
  selectedReference: MOCK_REFERENCES[0],
  activeCategory: 'all',
  setSelectedReference: (ref) => set({ selectedReference: ref }),
  setActiveCategory: (catId) => set({ activeCategory: catId }),

  ghostOpacity: 0.35,
  overlayMode: 'both',
  showGrid: true,
  cameraFacing: 'back',
  setGhostOpacity: (opacity) => set({ ghostOpacity: opacity }),
  setOverlayMode: (mode) => set({ overlayMode: mode }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleCameraFacing: () =>
    set((state) => ({ cameraFacing: state.cameraFacing === 'back' ? 'front' : 'back' })),

  alignmentFeedback: {
    overall_score: 85,
    pose_score: 88,
    composition_score: 90,
    angle_score: 84,
    distance_score: 82,
    primary_guidance: 'Rất tốt! Giữ máy thẳng và nhấn chụp!',
    secondary_guidance: 'Độ khớp: 85%',
    is_aligned_well: true,
    ready_to_snap: true,
  },
  setAlignmentFeedback: (feedback) => set({ alignmentFeedback: feedback }),

  capturedPhotos: [],
  activeComparison: null,
  selectedFilter: 'original',
  addCapturedPhoto: (photo) =>
    set((state) => ({
      capturedPhotos: [photo, ...state.capturedPhotos],
    })),
  setActiveComparison: (photo, reference, result = null) =>
    set({
      activeComparison: { photo, reference, result },
    }),
  setSelectedFilter: (filterId) => set({ selectedFilter: filterId }),
}));
