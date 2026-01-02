
import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { Gender } from '../types';
import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

// Fix: Use global JSX namespace to correctly extend intrinsic elements for React Three Fiber
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Official Three.js high-quality rigged model
const SOLDIER_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';

const Mannequin: React.FC = () => {
  const { gender, anatomy, rotations, clothes, isAgeVerified } = useStore();
  
  // Load the model. Using the same reliable rigged model for both to ensure stability.
  const { scene } = useGLTF(SOLDIER_URL);

  // Clone to prevent cross-contamination and allow unique transformations
  const clonedScene = useMemo(() => scene.clone(), [scene, gender]);

  useEffect(() => {
    clonedScene.traverse((object: any) => {
      // 1. SKELETAL RIGGING & ANATOMICAL SCALING
      if (object.isBone) {
        const name = object.name;
        
        // Soldier Model uses standard Mixamo-style bone names
        // Note: We use specific bone name matches for the Soldier rig
        
        // Torso & Spine
        if (name === 'vanguard_Spine1' || name === 'vanguard_Spine2') {
          object.rotation.set(rotations.spine.x, rotations.spine.y, rotations.spine.z);
          object.scale.set(anatomy.chest, 1, anatomy.chest);
        }
        if (name === 'vanguard_Spine') {
          object.scale.set(anatomy.waist, 1, anatomy.waist);
        }

        // Head & Neck
        if (name === 'vanguard_Neck') {
          object.rotation.set(rotations.neck.x, rotations.neck.y, rotations.neck.z);
          object.scale.set(anatomy.neck, 1, anatomy.neck);
        }
        if (name === 'vanguard_Head') {
          object.scale.setScalar(anatomy.head);
        }

        // Arms
        if (name === 'vanguard_LeftArm') {
          object.rotation.set(rotations.shoulderL.x, rotations.shoulderL.y, rotations.shoulderL.z);
          object.scale.set(anatomy.muscle, anatomy.arms, anatomy.muscle);
        }
        if (name === 'vanguard_RightArm') {
          object.rotation.set(rotations.shoulderR.x, rotations.shoulderR.y, rotations.shoulderR.z);
          object.scale.set(anatomy.muscle, anatomy.arms, anatomy.muscle);
        }

        // Hips & Legs
        if (name === 'vanguard_Hips') {
          object.scale.set(anatomy.hips, 1, anatomy.hips);
        }
        if (name === 'vanguard_LeftUpLeg') {
          object.rotation.set(rotations.hipL.x, rotations.hipL.y, rotations.hipL.z);
          object.scale.set(anatomy.muscle, anatomy.legs, anatomy.muscle);
        }
        if (name === 'vanguard_RightUpLeg') {
          object.rotation.set(rotations.hipR.x, rotations.hipR.y, rotations.hipR.z);
          object.scale.set(anatomy.muscle, anatomy.legs, anatomy.muscle);
        }
      }

      // 2. MESH VISIBILITY (Clothing Layers & Anatomy Mode)
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        const meshName = object.name;
        
        // Handle "Artistic Anatomy Mode" or individual layers
        // The Soldier model typically has components like helmet, gear, etc.
        const isGear = meshName.includes('Visor') || meshName.includes('Object');
        const isClothingPart = meshName.includes('Mesh') || meshName.includes('vanguard');

        // Artistic Nude/Anatomy logic: If top and bottom are unchecked, we show the "Base Body"
        // Since Soldier is a fused mesh, we simulate this by switching materials or hiding gear
        const isAnatomyMode = !clothes.top && !clothes.bottom && isAgeVerified;

        if (isAnatomyMode) {
          // Hide everything that looks like gear (helmet/visor/pouches)
          if (isGear) {
            object.visible = false;
          } else {
            object.visible = true;
            // Apply a neutral anatomical material
            const mat = object.material.clone();
            mat.color.set(gender === Gender.MALE ? "#bf9b7a" : "#d2b48c");
            mat.roughness = 0.8;
            mat.metalness = 0;
            object.material = mat;
          }
        } else {
          // Standard layered mode
          if (isGear) {
            object.visible = clothes.top; // Link helmet/gear to "top" layer for now
          }
          // Restore original material feel
          if (object.material) {
            const mat = object.material.clone();
            mat.roughness = 0.5;
            mat.metalness = 0.1;
            object.material = mat;
          }
        }
      }
    });
  }, [clonedScene, rotations, anatomy, clothes, isAgeVerified, gender]);

  return (
    <group scale={2.5} position={[0, -2.5, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

export default Mannequin;
