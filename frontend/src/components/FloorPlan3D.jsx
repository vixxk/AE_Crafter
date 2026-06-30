import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Grid,
  Stars,
  Sky,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import ThreeDSkeleton from './ThreeDSkeleton';

const FEET_TO_UNITS = 20;

const Wall = ({ position, rotation, args, color, isDark = true }) => {
  const wallColor = color || (isDark ? '#e2e8f0' : '#ffffff');
  const trimColor = isDark ? '#f472b6' : '#db2777';
  const baseboardColor = isDark ? '#181820' : '#e2e8f0';

  return (
    <group position={position} rotation={rotation}>
      {/* Main Wall Plaster */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Architectural Top Accent Trim */}
      <mesh position={[0, args[1] / 2 + 0.4, 0]}>
        <boxGeometry args={[args[0] + 0.2, 0.8, args[2] + 0.4]} />
        <meshStandardMaterial
          color={trimColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Baseboard */}
      <mesh position={[0, -args[1] / 2 + 0.4, args[2] / 2 + 0.1]}>
        <boxGeometry args={[args[0], 0.8, 0.4]} />
        <meshStandardMaterial color={baseboardColor} />
      </mesh>
    </group>
  );
};

const Bed = () => (
  <group position={[0, 1.5, 0]}>
    <mesh castShadow>
      <boxGeometry args={[12 * 8, 3, 12 * 10]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0, 2, 2]} castShadow>
      <boxGeometry args={[12 * 7.5, 2, 12 * 9.5]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>
    <mesh position={[0, 3.5, -45]} castShadow>
      <boxGeometry args={[12 * 6, 1.5, 12 * 2.5]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
  </group>
);

const Sofa = () => (
  <group position={[0, 1.5, 0]}>
    <mesh castShadow>
      <boxGeometry args={[120, 3, 50]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    <mesh position={[0, 5, -20]} castShadow>
      <boxGeometry args={[120, 8, 15]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    <mesh position={[-55, 4, 0]} castShadow>
      <boxGeometry args={[15, 6, 50]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    <mesh position={[55, 4, 0]} castShadow>
      <boxGeometry args={[15, 6, 50]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  </group>
);

const TVSet = () => (
  <group position={[0, 0, 0]}>
    <mesh position={[0, 4, 0]} castShadow>
      <boxGeometry args={[100, 8, 20]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
    <mesh position={[0, 20, 5]}>
      <boxGeometry args={[80, 45, 2]} />
      <meshStandardMaterial color="#000000" emissive="#1e293b" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

const Window = ({ width, height }) => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[width, height, 4]} />
      <meshStandardMaterial color="#334155" opacity={0.5} transparent />
    </mesh>
    <mesh>
      <boxGeometry args={[width - 8, height - 8, 1]} />
      <meshStandardMaterial color="#bae6fd" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);

const FlowerVase = () => (
  <group>
    <mesh castShadow position={[0, 4, 0]}>
      <cylinderGeometry args={[5, 3, 10, 8]} />
      <meshStandardMaterial color="#92400e" />
    </mesh>
    <mesh position={[0, 15, 0]}>
      <coneGeometry args={[10, 20, 8]} />
      <meshStandardMaterial color="#166534" roughness={1} />
    </mesh>
  </group>
);

const Shower = () => (
  <group position={[0, 0, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
    </mesh>
    <mesh position={[20, 80, 0]}>
      <boxGeometry args={[5, 120, 5]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.8} />
    </mesh>
    <mesh position={[5, 140, 0]} rotation={[0, 0, Math.PI / 4]}>
      <cylinderGeometry args={[8, 5, 10, 16]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.8} />
    </mesh>
  </group>
);

const Toilet = () => (
  <group position={[0, 0, 0]}>
    <mesh position={[0, 8, 0]} castShadow>
      <boxGeometry args={[15, 15, 25]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.1} />
    </mesh>
    <mesh position={[0, 25, -12]} castShadow>
      <boxGeometry args={[15, 20, 8]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.1} />
    </mesh>
  </group>
);

const Fridge = () => (
  <group position={[0, 35, 0]}>
    <mesh castShadow>
      <boxGeometry args={[30, 70, 30]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
    </mesh>
    <mesh position={[12, 10, 16]}>
      <boxGeometry args={[2, 20, 2]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  </group>
);

const KitchenCounter = ({ width }) => (
  <group position={[0, 4, 0]}>
    <mesh castShadow>
      <boxGeometry args={[width, 8, 15]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>
    <mesh position={[0, 4.2, 0]}>
      <boxGeometry args={[width + 2, 0.5, 17]} />
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
    </mesh>
    <group position={[-width / 4, 4.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  </group>
);

const Room3D = ({ room, isDark = true }) => {
  const { width, height, wallHeight: rawWallHeight, x, y, type } = room;
  const wallHeight = rawWallHeight || 10;
  const color = getRoomColor(type);

  const centerX = (x + width / 2) * FEET_TO_UNITS;
  const centerZ = (y + height / 2) * FEET_TO_UNITS;

  const w = width * FEET_TO_UNITS;
  const h = height * FEET_TO_UNITS;
  const wh = wallHeight * FEET_TO_UNITS;

  return (
    <group position={[centerX, 0, centerZ]}>
      {/* Room Floor Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.2, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color={color}
          roughness={type === 'kitchen' || type === 'bathroom' ? 0.3 : 0.7}
          metalness={0.1}
          opacity={0.88}
        />
      </mesh>

      {/* Modern Glassmorphic Room Info Badge */}
      <Html position={[0, wh + 12, 0]} center distanceFactor={600}>
        <div style={{
          background: isDark ? 'rgba(17, 17, 22, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          border: `1.8px solid ${isDark ? 'rgba(244, 114, 182, 0.55)' : 'rgba(219, 39, 119, 0.45)'}`,
          padding: '6px 14px',
          borderRadius: '16px',
          color: isDark ? '#ffffff' : '#18181b',
          fontSize: '14px',
          fontWeight: '800',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          boxShadow: isDark
            ? '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 14px rgba(244, 114, 182, 0.25)'
            : '0 6px 18px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          fontFamily: 'Outfit, Arial, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ letterSpacing: '0.6px' }}>{type.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '600', opacity: 0.75 }}>
            {`${width}' × ${height}'`}
          </span>
        </div>
      </Html>

      {/* Room Grid Texture Overlay */}
      <Grid
        args={[w, h]}
        cellSize={FEET_TO_UNITS}
        sectionSize={FEET_TO_UNITS * 4}
        cellThickness={0.4}
        cellColor={isDark ? '#ffffff' : '#000000'}
        opacity={isDark ? 0.08 : 0.04}
        position={[0, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Furniture Sets */}
      {(type === 'living room' || type === 'bedroom') && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]} receiveShadow>
          <planeGeometry args={[w * 0.7, h * 0.7]} />
          <meshStandardMaterial color={type === 'living room' ? '#334155' : '#475569'} opacity={0.3} transparent />
        </mesh>
      )}

      {type === 'bedroom' && (
        <>
          <Bed />
          <group position={[-w / 2 + 20, 0, -h / 2 + 20]}>
            <FlowerVase />
          </group>
        </>
      )}

      {type === 'living room' && (
        <>
          <group position={[0, 0, h / 2 - 35]}>
            <Sofa />
          </group>
          <group position={[0, 0, -h / 2 + 15]} rotation={[0, Math.PI, 0]}>
            <TVSet />
          </group>
          <group position={[w / 2 - 20, 0, h / 2 - 20]}>
            <FlowerVase />
          </group>
          <group position={[-w / 2 + 20, 0, h / 2 - 20]}>
            <FlowerVase />
          </group>
        </>
      )}

      {type === 'kitchen' && (
        <>
          <group position={[0, 0, -h / 2 + 8]}>
            <KitchenCounter width={w - 10} />
          </group>
          <group position={[w / 2 - 25, 0, -h / 2 + 25]}>
            <Fridge />
          </group>
        </>
      )}

      {type === 'bathroom' && (
        <>
          <group position={[-w / 2 + 30, 0, -h / 2 + 30]}>
            <Shower />
          </group>
          <group position={[w / 2 - 20, 0, h / 2 - 20]} rotation={[0, -Math.PI / 2, 0]}>
            <Toilet />
          </group>
        </>
      )}

      {type === 'dining area' && (
        <group>
          <mesh position={[0, 10, 0]} castShadow>
            <boxGeometry args={[80, 3, 120]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          {[[-50, 0], [50, 0], [0, -70], [0, 70]].map((pos, i) => (
            <mesh key={i} position={[pos[0], 5, pos[1]]} castShadow>
              <boxGeometry args={[20, 10, 20]} />
              <meshStandardMaterial color="#1e2d3b" />
            </mesh>
          ))}
        </group>
      )}

      {/* Solid Walls */}
      <Wall position={[-w / 2, wh / 2, 0]} rotation={[0, Math.PI / 2, 0]} args={[h, wh, 2]} isDark={isDark} />
      <Wall position={[w / 2, wh / 2, 0]} rotation={[0, Math.PI / 2, 0]} args={[h, wh, 2]} isDark={isDark} />
      <Wall position={[0, wh / 2, -h / 2]} rotation={[0, 0, 0]} args={[w, wh, 2]} isDark={isDark} />

      <group position={[0, wh / 2, h / 2]}>
        <Wall position={[0, 0, 0]} rotation={[0, 0, 0]} args={[w, wh, 2]} isDark={isDark} />
        <group position={[0, 5, 2]}>
          <Window width={Math.min(60, w * 0.6)} height={40} />
        </group>
      </group>
    </group>
  );
};

const FloorPlan3D = ({ layout, theme = 'dark' }) => {
  if (!layout || !layout.rooms) return null;
  const isDark = theme !== 'light';
  const { plot, rooms } = layout;

  const centerX = (plot.width * FEET_TO_UNITS) / 2;
  const centerZ = (plot.height * FEET_TO_UNITS) / 2;
  const maxDim = Math.max(plot.width, plot.height) * FEET_TO_UNITS;
  const wh = (rooms[0]?.wallHeight || 10) * FEET_TO_UNITS;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
        background: isDark ? '#09090c' : '#f8fafc',
        position: 'relative'
      }}
    >
      <Suspense fallback={<ThreeDSkeleton isSuspense />}>
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: 'high-performance'
          }}
          camera={{
            position: [centerX + maxDim * 0.85, maxDim * 0.95, centerZ + maxDim * 0.85],
            fov: 40,
            near: 1,
            far: 30000
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
        >
          {/* Background color */}
          <color attach="background" args={[isDark ? '#09090c' : '#f8fafc']} />

          {/* Sky or Starfield */}
          {isDark ? (
            <Stars radius={maxDim * 2.5} depth={maxDim} count={2500} factor={4} saturation={0} fade speed={1} />
          ) : (
            <Sky distance={450000} sunPosition={[5, 2, 8]} inclination={0.2} azimuth={0.25} />
          )}

          {/* Studio Architectural Lighting Setup (100% Reliable, Zero Network Lag) */}
          <ambientLight intensity={isDark ? 0.65 : 0.8} />

          <hemisphereLight
            args={[
              isDark ? '#38bdf8' : '#ffffff',
              isDark ? '#1e1b4b' : '#cbd5e1',
              isDark ? 0.6 : 0.5
            ]}
          />

          {/* Key Directional Sunlight with Shadows */}
          <directionalLight
            position={[centerX + maxDim * 0.8, maxDim * 1.5, centerZ + maxDim * 0.6]}
            intensity={isDark ? 1.6 : 1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-maxDim * 0.8}
            shadow-camera-right={maxDim * 0.8}
            shadow-camera-top={maxDim * 0.8}
            shadow-camera-bottom={-maxDim * 0.8}
            shadow-camera-near={10}
            shadow-camera-far={maxDim * 4}
            shadow-bias={-0.0005}
          />

          {/* Soft Fill Light from Opposite Side */}
          <directionalLight
            position={[centerX - maxDim * 0.7, maxDim * 0.8, centerZ - maxDim * 0.7]}
            intensity={isDark ? 0.6 : 0.4}
          />

          {/* Interior House Ambient Glow */}
          <pointLight
            position={[centerX, wh * 1.8, centerZ]}
            intensity={isDark ? 3.0 : 1.5}
            distance={maxDim * 1.8}
            decay={2}
            color={isDark ? '#fbcfe8' : '#ffffff'}
          />

          {/* Site Ground Foundation */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[centerX, -1, centerZ]}
            receiveShadow
          >
            <planeGeometry args={[maxDim * 4, maxDim * 4]} />
            <meshStandardMaterial
              color={isDark ? '#111018' : '#f1f5f9'}
              roughness={0.9}
            />
          </mesh>

          {/* Architectural Ground Grid with Pink/Rose Accents */}
          <Grid
            infiniteGrid
            cellColor={isDark ? '#261f2c' : '#e2e8f0'}
            sectionColor={isDark ? 'rgba(244, 114, 182, 0.4)' : 'rgba(219, 39, 119, 0.35)'}
            cellSize={FEET_TO_UNITS}
            sectionSize={FEET_TO_UNITS * 5}
            fadeDistance={maxDim * 3.5}
            position={[centerX, -0.5, centerZ]}
          />

          {/* 3D Rooms and Architectural Elements */}
          {rooms.map((room) => (
            <Room3D key={room.id} room={room} isDark={isDark} />
          ))}

          {/* Interactive Orbit Camera Controls */}
          <OrbitControls
            makeDefault
            target={[centerX, wh / 2, centerZ]}
            maxPolarAngle={Math.PI / 2.05}
            minDistance={80}
            maxDistance={maxDim * 4}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

const getRoomColor = (type) => {
  switch (type.toLowerCase()) {
    case 'bedroom': return '#6366f1';
    case 'living room': return '#4f46e5';
    case 'kitchen': return '#f59e0b';
    case 'bathroom': return '#06b6d4';
    case 'dining area': return '#ec4899';
    case 'study': return '#10b981';
    case 'guest room': return '#f43f5e';
    case 'balcony': return '#8b5cf6';
    case 'garage': return '#64748b';
    case 'corridor': return '#475569';
    case 'staircase': return '#0d9488';
    case 'puja room': return '#d97706';
    default: return '#334155';
  }
};

export default FloorPlan3D;
