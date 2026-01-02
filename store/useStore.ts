
import { create } from 'zustand';
import { Gender, PoseState, Vector3 } from '../types';

interface AppState extends PoseState {
  setGender: (gender: Gender) => void;
  setAnatomy: (part: string, value: number) => void;
  setRotation: (boneName: string, rotation: Vector3) => void;
  setClothing: (item: 'top' | 'bottom' | 'shoes', value: boolean) => void;
  setLightIntensity: (val: number) => void;
  setAgeVerified: (verified: boolean) => void;
  resetPose: () => void;
}

const initialRotations: Record<string, Vector3> = {
  neck: { x: 0, y: 0, z: 0 },
  spine: { x: 0, y: 0, z: 0 },
  shoulderL: { x: 0, y: 0, z: -0.2 },
  shoulderR: { x: 0, y: 0, z: 0.2 },
  elbowL: { x: 0, y: 0, z: 0 },
  elbowR: { x: 0, y: 0, z: 0 },
  hipL: { x: 0.1, y: 0, z: 0 },
  hipR: { x: 0.1, y: 0, z: 0 },
  kneeL: { x: 0, y: 0, z: 0 },
  kneeR: { x: 0, y: 0, z: 0 },
};

export const useStore = create<AppState>((set) => ({
  gender: Gender.MALE,
  anatomy: {
    head: 1,
    neck: 1,
    shoulders: 1,
    chest: 1,
    waist: 1,
    hips: 1,
    arms: 1,
    legs: 1,
    muscle: 1,
  },
  rotations: initialRotations,
  clothes: {
    top: true,
    bottom: true,
    shoes: true,
  },
  lightSettings: {
    intensity: 1.5,
    color: '#ffffff',
    position: { x: 5, y: 5, z: 5 },
  },
  isAgeVerified: false,

  setGender: (gender) => set({ gender }),
  setAnatomy: (part, value) => set((state) => ({
    anatomy: { ...state.anatomy, [part]: value }
  })),
  setRotation: (boneName, rotation) => set((state) => ({
    rotations: { ...state.rotations, [boneName]: rotation }
  })),
  setClothing: (item, value) => set((state) => ({
    clothes: { ...state.clothes, [item]: value }
  })),
  setLightIntensity: (intensity) => set((state) => ({
    lightSettings: { ...state.lightSettings, intensity }
  })),
  setAgeVerified: (isAgeVerified) => set({ isAgeVerified }),
  resetPose: () => set({ rotations: initialRotations }),
}));
