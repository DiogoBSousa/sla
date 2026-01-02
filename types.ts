
import React from 'react';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface BodyPartScale {
  head: number;
  neck: number;
  shoulders: number;
  chest: number;
  waist: number;
  hips: number;
  arms: number;
  legs: number;
  muscle: number;
}

export interface PoseState {
  gender: Gender;
  anatomy: BodyPartScale;
  rotations: Record<string, Vector3>;
  clothes: {
    top: boolean;
    bottom: boolean;
    shoes: boolean;
  };
  lightSettings: {
    intensity: number;
    color: string;
    position: Vector3;
  };
  isAgeVerified: boolean;
}
