
import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import Mannequin from './Mannequin';
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';

// Fix: Ensure global JSX namespace includes ThreeElements for Three.js intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const LoadingFallback = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-50">
    <div className="relative">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <div className="absolute inset-0 w-12 h-12 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
    </div>
    <p className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase animate-pulse">Initializing Human Assets...</p>
  </div>
);

const Viewport3D: React.FC = () => {
  const { lightSettings } = useStore();

  return (
    <div className="w-full h-full bg-[#080c14] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas shadows camera={{ position: [3, 1, 5], fov: 35 }}>
          <color attach="background" args={['#080c14']} />
          
          {/* Professional 3-Point Studio Lighting */}
          <ambientLight intensity={0.6} />
          
          {/* Key Light */}
          <directionalLight 
            position={[lightSettings.position.x, lightSettings.position.y, lightSettings.position.z]} 
            intensity={lightSettings.intensity} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          >
            <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
          </directionalLight>

          {/* Rim Light */}
          <pointLight position={[-5, 3, -5]} intensity={1.5} color="#4466ff" />
          
          {/* Fill Light */}
          <rectAreaLight width={10} height={10} intensity={0.5} position={[5, 0, -5]} color="#ffaa88" />

          <Mannequin />
          
          <Grid 
            infiniteGrid 
            fadeDistance={25} 
            fadeStrength={2} 
            sectionColor="#1e293b" 
            cellColor="#0f172a" 
          />
          
          <ContactShadows 
            opacity={0.8} 
            scale={12} 
            blur={2.5} 
            far={10} 
            resolution={512} 
            color="#000000" 
          />
          
          <Environment preset="studio" blur={1} />

          <OrbitControls 
            makeDefault 
            minDistance={2} 
            maxDistance={12} 
            enableDamping 
            dampingFactor={0.05}
            target={[0, 0, 0]}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Viewport3D;
