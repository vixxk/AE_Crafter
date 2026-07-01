import React from 'react';
import { Box, Layers, Cuboid as Cube } from 'lucide-react';

const ThreeDSkeleton = ({ mode = 'manual', isSuspense = false }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--canvas-bg)',
        overflow: 'hidden',
      }}
    >
      {/* 3D Perspective Isometric Grid Background */}
      <div
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(600px) rotateX(60deg) translateY(-20%)',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Center 3D Isometric Wireframe Cube Cluster Skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          position: 'relative',
          width: '320px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="320"
          height="280"
          viewBox="0 0 320 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          {/* Base Floor Plate Wireframe */}
          <polygon
            points="160,50 280,120 160,190 40,120"
            stroke="var(--border-color)"
            strokeWidth="1.5"
            fill="var(--card-bg-elevated)"
            fillOpacity="0.4"
          />

          {/* Isometric Building Mass 1 */}
          <g className="skeleton-shimmer">
            {/* Top face */}
            <polygon
              points="160,20 220,55 160,90 100,55"
              fill="rgba(16, 185, 129, 0.15)"
              stroke="var(--primary-color)"
              strokeWidth="1.5"
            />
            {/* Left face */}
            <polygon
              points="100,55 160,90 160,150 100,115"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="var(--primary-color)"
              strokeWidth="1.5"
            />
            {/* Right face */}
            <polygon
              points="160,90 220,55 220,115 160,150"
              fill="rgba(16, 185, 129, 0.12)"
              stroke="var(--primary-color)"
              strokeWidth="1.5"
            />
          </g>

          {/* Isometric Building Mass 2 (Wing) */}
          <g style={{ opacity: 0.7 }}>
            {/* Top face */}
            <polygon
              points="100,75 140,98 100,121 60,98"
              fill="rgba(255, 255, 255, 0.04)"
              stroke="var(--border-color)"
              strokeWidth="1.2"
            />
            {/* Left face */}
            <polygon
              points="60,98 100,121 100,165 60,142"
              fill="rgba(255, 255, 255, 0.02)"
              stroke="var(--border-color)"
              strokeWidth="1.2"
            />
            {/* Right face */}
            <polygon
              points="100,121 140,98 140,142 100,165"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="var(--border-color)"
              strokeWidth="1.2"
            />
          </g>

          {/* Isometric Building Mass 3 (Rear Wing) */}
          <g style={{ opacity: 0.7 }}>
            {/* Top face */}
            <polygon
              points="220,75 260,98 220,121 180,98"
              fill="rgba(255, 255, 255, 0.04)"
              stroke="var(--border-color)"
              strokeWidth="1.2"
            />
            {/* Left face */}
            <polygon
              points="180,98 220,121 220,165 180,142"
              fill="rgba(255, 255, 255, 0.02)"
              stroke="var(--border-color)"
              strokeWidth="1.2"
            />
            {/* Right face */}
            <polygon
              points="220,121 260,98 260,142 220,165"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="var(--border-color)"
              strokeWidth="1.2"
            />
          </g>

          {/* Structural Vertical Guides with Marching Dash Animation */}
          <line
            x1="160"
            y1="20"
            x2="160"
            y2="190"
            stroke="var(--primary-color)"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            strokeOpacity="0.5"
            style={{ animation: 'dashMarch 1.2s linear infinite' }}
          />
          <line
            x1="100"
            y1="55"
            x2="100"
            y2="165"
            stroke="var(--primary-color)"
            strokeDasharray="4 4"
            strokeWidth="1"
            strokeOpacity="0.35"
            style={{ animation: 'dashMarch 1.5s linear infinite' }}
          />
          <line
            x1="220"
            y1="55"
            x2="220"
            y2="165"
            stroke="var(--primary-color)"
            strokeDasharray="4 4"
            strokeWidth="1"
            strokeOpacity="0.35"
            style={{ animation: 'dashMarch 1.5s linear infinite' }}
          />
        </svg>
      </div>

      {/* Floating Status Pill */}
      <div
        style={{
          position: 'absolute',
          bottom: '44px',
          background: 'var(--card-bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: '30px',
          padding: '10px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
          zIndex: 10,
        }}
      >
        <span
          style={{
            position: 'relative',
            display: 'flex',
            height: '10px',
            width: '10px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              display: 'inline-flex',
              height: '100%',
              width: '100%',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-color)',
              opacity: 0.75,
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              borderRadius: '50%',
              height: '10px',
              width: '10px',
              backgroundColor: 'var(--primary-color)',
            }}
          />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-color)' }}>
              {isSuspense
                ? 'Mounting 3D Scene'
                : mode === 'ai'
                ? 'Synthesizing 3D Architectural Model'
                : 'Constructing 3D Geometry'}
            </span>
            <span style={{ display: 'inline-flex', gap: '3px', color: 'var(--primary-color)' }}>
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Generating wall extrusions, spatial lighting & room volumes
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSkeleton;
