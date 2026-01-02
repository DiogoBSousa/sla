
import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { Gender } from '../types';
import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

// Fix for JSX intrinsic element errors: extend the JSX namespace to include Three.js elements
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

// Professional rigged models from official Three.js CDN
const MODELS = {
  [Gender.MALE]: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/XBot.glb',
  [Gender.FEMALE]: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/YBot.glb'
};

const Mannequin: React.FC = () => {
  const { gender, anatomy, rotations, clothes, isAgeVerified } = useStore();
  
  // Load model with Suspense support
  const { scene } = useGLTF(MODELS[gender]);

  // Clone to prevent cross-contamination between gender switches
  const clonedScene = useMemo(() => scene.clone(), [scene, gender]);

  useEffect(() => {
    clonedScene.traverse((object: any) => {
      // 1. SKELETAL RIGGING & ANATOMY
      if (object.isBone) {
        const name = object.name.toLowerCase();
        
        // MIXAMO BONE MAPPING
        // Spine / Torso
        if (name.includes('spine1') || name.includes('spine2')) {
          object.rotation.set(rotations.spine.x, rotations.spine.y, rotations.spine.z);
          object.scale.set(anatomy.chest, 1, anatomy.chest); // Chest/Breast volume
        }
        if (name.includes('spine') && !name.includes('1') && !name.includes('2')) {
          object.scale.set(anatomy.waist, 1, anatomy.waist);
        }

        // Neck & Head
        if (name.includes('neck')) {
          object.rotation.set(rotations.neck.x, rotations.neck.y, rotations.neck.z);
          object.scale.set(anatomy.neck, 1, anatomy.neck);
        }
        if (name.includes('head')) {
          object.scale.setScalar(anatomy.head);
        }

        // Shoulders & Arms
        if (name.includes('leftarm')) {
          object.rotation.set(rotations.shoulderL.x, rotations.shoulderL.y, rotations.shoulderL.z);
          object.scale.set(anatomy.muscle, anatomy.arms, anatomy.muscle);
        }
        if (name.includes('rightarm')) {
          object.rotation.set(rotations.shoulderR.x, rotations.shoulderR.y, rotations.shoulderR.z);
          object.scale.set(anatomy.muscle, anatomy.arms, anatomy.muscle);
        }
        if (name.includes('forearm')) {
          object.scale.set(anatomy.muscle, 1, anatomy.muscle);
        }

        // Hips & Legs
        if (name.includes('hips')) {
          object.scale.set(anatomy.hips, 1, anatomy.hips);
        }
        if (name.includes('leftupleg')) {
          object.rotation.set(rotations.hipL.x, rotations.hipL.y, rotations.hipL.z);
          object.scale.set(anatomy.muscle, anatomy.legs, anatomy.muscle);
        }
        if (name.includes('rightupleg')) {
          object.rotation.set(rotations.hipR.x, rotations.hipR.y, rotations.hipR.z);
          object.scale.set(anatomy.muscle, anatomy.legs, anatomy.muscle);
        }
        if (name.includes('leg') && !name.includes('up')) {
          object.scale.set(anatomy.muscle, 1, anatomy.muscle);
        }
      }

      // 2. MATERIALS & VISIBILITY
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        if (object.material) {
          const mat = object.material.clone();
          
          // Artistic Nude/Anatomy Mode Logic
          // If Top/Bottom are off and user is verified, we treat the model as a clean anatomical base
          const isNudeMode = !clothes.top && !clothes.bottom && isAgeVerified;
          
          if (isNudeMode) {
            mat.color.set(gender === Gender.MALE ? "#d2b48c" : "#eecfa1");
            mat.roughness = 0.8;
            mat.metalness = 0;
          } else {
            // Standard "Studio Reference" appearance
            mat.roughness = 0.4;
            mat.metalness = 0.2;
          }
          
          object.material = mat;
        }
      }
    });
  }, [clonedScene, rotations, anatomy, clothes, isAgeVerified, gender]);

  return (
    // Re-render using fixed intrinsic element types
    <group scale={2.2} position={[0, -2.2, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

export default Mannequin;
