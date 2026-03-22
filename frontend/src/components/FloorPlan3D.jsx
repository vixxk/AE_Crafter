import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Grid,
  Stars,
  Float,
  Sky,
  Text,
  Html,
  ContactShadows,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';

const FEET_TO_UNITS = 20;

const Wall = ({ position, rotation, args, color = "#cbd5e1" }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Baseboard */}
      <mesh position={[0, -args[1] / 2 + 0.3, args[2] / 2 + 0.1]}>
        <boxGeometry args={[args[0], 0.6, 0.4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Simple Furniture Primitives
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
    {/* Cabinet */}
    <mesh position={[0, 4, 0]} castShadow>
      <boxGeometry args={[100, 8, 20]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
    {/* Screen */}
    <mesh position={[0, 20, 5]}>
      <boxGeometry args={[80, 45, 2]} />
      <meshStandardMaterial color="#000000" emissive="#1e293b" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

const Window = ({ width, height }) => (
  <group>
    {/* Frame */}
    <mesh castShadow>
      <boxGeometry args={[width, height, 4]} />
      <meshStandardMaterial color="#334155" opacity={0.5} transparent />
    </mesh>
    {/* Glass */}
    <mesh>
      <boxGeometry args={[width - 8, height - 8, 1]} />
      <meshStandardMaterial color="#bae6fd" transparent opacity={0.2} metalness={1} roughness={0} />
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
    {/* Floor Drain Area */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
    </mesh>
    {/* Pipe */}
    <mesh position={[20, 80, 0]}>
      <boxGeometry args={[5, 120, 5]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.8} />
    </mesh>
    {/* Shower Head */}
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

const KitchenCounter = ({ width, height }) => (
  <group position={[0, 4, 0]}>
    <mesh castShadow>
      <boxGeometry args={[width, 8, 15]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>
    <mesh position={[0, 4.2, 0]}>
      <boxGeometry args={[width + 2, 0.5, 17]} />
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Stove */}
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

const Room3D = ({ room }) => {
  const { width, height, wallHeight: rawWallHeight, x, y, type } = room;
  const wallHeight = rawWallHeight || 10;
  const color = getRoomColor(type);

  // Scale Konva units (ft) -> ThreeJS units
  const centerX = (x + width / 2) * FEET_TO_UNITS;
  const centerZ = (y + height / 2) * FEET_TO_UNITS;
  const centerY = (wallHeight * FEET_TO_UNITS) / 2;

  const w = width * FEET_TO_UNITS;
  const h = height * FEET_TO_UNITS;
  const wh = wallHeight * FEET_TO_UNITS;

  return (
    <group position={[centerX, 0, centerZ]}>
      {/* Floor with specialized texture per room type */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.1, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color={color}
          roughness={type === 'kitchen' || type === 'bathroom' ? 0.2 : 0.8}
          metalness={type === 'kitchen' || type === 'bathroom' ? 0.3 : 0.1}
          opacity={0.9}
        />
      </mesh>

      {/* Center Label - Always Readable */}
      <group position={[0, wh + 10, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text
            fontSize={15}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
            outlineWidth={1.5}
            outlineColor="#ffffff"
          >
            {type.toUpperCase()}
          </Text>
          <Text
            fontSize={11}
            color="#334155"
            position={[0, -15, 0]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={1}
            outlineColor="#ffffff"
          >
            {`${width}' x ${height}'`}
          </Text>
        </Float>
      </group>

      {/* Floating Badge (Glassmorphism UI) */}
      <Html position={[0, wh / 2, 0]} center distanceFactor={150}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
          {type}
        </div>
      </Html>

      {/* Tiles/Wood Pattern overlay (Simplified) */}
      <Grid
        args={[w, h]}
        cellSize={FEET_TO_UNITS}
        sectionSize={FEET_TO_UNITS * 5}
        cellThickness={0.5}
        cellColor="#ffffff"
        opacity={0.1}
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Furniture Placement */}
      {/* Rugs */}
      {(type === 'living room' || type === 'bedroom') && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} receiveShadow>
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
      {(type === 'kitchen') && (
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
          {/* Chairs */}
          {[[-50, 0], [50, 0], [0, -70], [0, 70]].map((pos, i) => (
            <mesh key={i} position={[pos[0], 5, pos[1]]} castShadow>
              <boxGeometry args={[20, 10, 20]} />
              <meshStandardMaterial color="#1e2d3b" />
            </mesh>
          ))}
        </group>
      )}

      {/* Walls with Openings */}
      <Wall position={[-w / 2, wh / 2, 0]} rotation={[0, Math.PI / 2, 0]} args={[h, wh, 2]} />
      <Wall position={[w / 2, wh / 2, 0]} rotation={[0, Math.PI / 2, 0]} args={[h, wh, 2]} />
      <Wall position={[0, wh / 2, -h / 2]} rotation={[0, 0, 0]} args={[w, wh, 2]} />

      {/* Front Wall with Window */}
      <group position={[0, wh / 2, h / 2]}>
        <Wall position={[0, 0, 0]} rotation={[0, 0, 0]} args={[w, wh, 2]} />
        <group position={[0, 5, 2]}>
          <Window width={60} height={40} />
        </group>
      </group>
    </group>
  );
};

const FloorPlan3D = ({ layout }) => {
  if (!layout || !layout.rooms) return null;
  const { plot, rooms } = layout;
  const wh = (rooms[0]?.wallHeight || 10) * FEET_TO_UNITS;

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'move' }}>
      <Suspense fallback={<div className="loading-spinner" />}>
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            position: [plot.width * FEET_TO_UNITS, plot.width * FEET_TO_UNITS, plot.height * FEET_TO_UNITS],
            fov: 40,
            near: 1,
            far: 20000
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
        >
          <color attach="background" args={['#f0f9ff']} />
          <Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0} azimuth={1} />

          <ambientLight intensity={0.7} />
          <pointLight position={[plot.width * FEET_TO_UNITS / 2, wh * 3, plot.height * FEET_TO_UNITS / 2]} intensity={5.0} castShadow />
          <directionalLight
            position={[5000, 10000, 5000]}
            intensity={2.0}
            castShadow
            shadow-camera-left={-5000}
            shadow-camera-right={5000}
            shadow-camera-top={5000}
            shadow-camera-bottom={-5000}
            shadow-mapSize={[4096, 4096]}
          />

          <Environment preset="city" />

          {/* Realistic Floor Shadows */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.6}
            scale={5000}
            blur={1}
            far={50}
            resolution={1024}
            color="#000000"
          />

          {/* Main Floor (Plot Area) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(plot.width * FEET_TO_UNITS) / 2, -2, (plot.height * FEET_TO_UNITS) / 2]} receiveShadow>
            <planeGeometry args={[plot.width * 10 * FEET_TO_UNITS, plot.height * 10 * FEET_TO_UNITS]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <Grid
            infiniteGrid
            cellColor="#cbd5e1"
            sectionColor="var(--primary-color)"
            cellSize={FEET_TO_UNITS}
            sectionSize={FEET_TO_UNITS * 5}
            fadeDistance={5000}
            position={[(plot.width * FEET_TO_UNITS) / 2, -0.5, (plot.height * FEET_TO_UNITS) / 2]}
          />
          {rooms.map((room) => (
            <Room3D key={room.id} room={room} />
          ))}

          <OrbitControls makeDefault target={[(plot.width * FEET_TO_UNITS) / 2, 0, (plot.height * FEET_TO_UNITS) / 2]} />
        </Canvas>
      </Suspense>
    </div>
  );
};

const getRoomColor = (type) => {
  switch (type.toLowerCase()) {
    case 'bedroom': return '#6366f1';
    case 'living room': return '#4f46e5';
    case 'kitchen': return '#fbbf24';
    case 'bathroom': return '#06b6d4';
    case 'dining area': return '#ec4899';
    case 'study': return '#10b981';
    case 'guest room': return '#f43f5e';
    case 'balcony': return '#8b5cf6';
    case 'garage': return '#64748b';
    default: return '#334155';
  }
};

export default FloorPlan3D;
