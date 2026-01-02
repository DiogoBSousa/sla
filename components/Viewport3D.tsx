
import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import Mannequin from './Mannequin';
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';

// Fix for JSX intrinsic element errors: extend the JSX namespace to include Three.js elements
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

const LoadingFallback = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Loading Pro Assets...</p>
  </div>
);

const Viewport3D: React.FC = () => {
  const { lightSettings } = useStore();

  return (
    <div className="w-full h-full bg-[#0f172a] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas shadows camera={{ position: [4, 2, 4], fov: 40 }}>
          {/* Support for intrinsic elements like color and lighting */}
          <color attach="background" args={['#0f172a']} />
          
          {/* Enhanced Studio Lighting for Artistic Reference */}
          <ambientLight intensity={0.5} />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#4444ff" />
          <directionalLight 
            position={[lightSettings.position.x, lightSettings.position.y, lightSettings.position.z]} 
            intensity={lightSettings.intensity} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          >
            <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
          </directionalLight>
          
          <Mannequin />
          
          <Grid 
            infiniteGrid 
            fadeDistance={30} 
            fadeStrength={3} 
            sectionColor="#1e293b" 
            cellColor="#334155" 
          />
          <ContactShadows opacity={0.6} scale={10} blur={2} far={10} />
          <Environment preset="studio" />

          <OrbitControls 
            makeDefault 
            minDistance={2} 
            maxDistance={15} 
            enableDamping 
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Viewport3D;
