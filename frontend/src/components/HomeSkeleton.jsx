import React from 'react';
import { Compass, Layers, Sparkles } from 'lucide-react';

const HomeSkeleton = ({ mode = 'manual', isRebuilding = false, theme = 'dark' }) => {
  const isDark = theme !== 'light';
  const pinkAccent = isDark ? 'rgba(244, 114, 182, 0.35)' : 'rgba(219, 39, 119, 0.35)';
  const pinkAccentSubtle = isDark ? 'rgba(244, 114, 182, 0.25)' : 'rgba(219, 39, 119, 0.2)';
  const pinkDashed = isDark ? 'rgba(244, 114, 182, 0.3)' : 'rgba(219, 39, 119, 0.25)';
  const textBarBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';
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
        padding: '30px',
      }}
    >
      {/* Background Architectural Blueprint Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          animation: 'gridDrift 30s linear infinite',
        }}
      />

      {/* Main Blueprint Sheet Placeholder */}
      <div
        className="skeleton-pulse"
        style={{
          width: 'min(720px, 90%)',
          height: 'min(540px, 85%)',
          background: 'var(--card-bg)',
          border: '1.5px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Animated Laser Scanning Beam */}
        <div
          className="blueprint-scan-laser"
          style={{
            background: isDark
              ? undefined
              : 'linear-gradient(90deg, transparent 0%, rgba(219, 39, 119, 0.6) 20%, #db2777 50%, rgba(219, 39, 119, 0.6) 80%, transparent 100%)',
            boxShadow: isDark
              ? undefined
              : '0 0 16px rgba(219, 39, 119, 0.7), 0 0 30px rgba(219, 39, 119, 0.35)',
          }}
        />
        {/* Top dimension bar placeholder */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '0 8px',
          }}
        >
          <div style={{ height: '2px', flex: 1, background: 'var(--border-color)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: '-4px', width: '2px', height: '10px', background: 'var(--border-color)' }} />
            <div style={{ position: 'absolute', right: 0, top: '-4px', width: '2px', height: '10px', background: 'var(--border-color)' }} />
          </div>
          <div
            className="skeleton-shimmer"
            style={{
              width: '70px',
              height: '18px',
              borderRadius: '6px',
              margin: '0 12px',
              border: '1px solid var(--border-color)',
            }}
          />
          <div style={{ height: '2px', flex: 1, background: 'var(--border-color)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: '-4px', width: '2px', height: '10px', background: 'var(--border-color)' }} />
            <div style={{ position: 'absolute', right: 0, top: '-4px', width: '2px', height: '10px', background: 'var(--border-color)' }} />
          </div>
        </div>

        {/* Setback dashed boundary */}
        <div
          style={{
            flex: 1,
            border: `1.5px dashed ${pinkDashed}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '14px',
            position: 'relative',
          }}
        >
          {/* Skeleton Room 1: Master Bedroom */}
          <div
            className="skeleton-shimmer"
            style={{
              border: `1.5px solid ${pinkAccent}`,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              animationDelay: '0s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '90px', height: '12px', borderRadius: '4px', background: textBarBg }} />
              <div style={{ width: '45px', height: '10px', borderRadius: '4px', background: pinkAccentSubtle }} />
            </div>
            {/* Door swing indicator sketch */}
            <div style={{ width: '24px', height: '24px', borderRight: '1.5px solid var(--border-color)', borderBottom: '1.5px solid var(--border-color)', borderRadius: '0 0 24px 0', alignSelf: 'flex-start' }} />
          </div>

          {/* Skeleton Room 2: Living Room */}
          <div
            className="skeleton-shimmer"
            style={{
              border: `1.5px solid ${pinkAccent}`,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animationDelay: '0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '12px', borderRadius: '4px', background: textBarBg }} />
              <div style={{ width: '45px', height: '10px', borderRadius: '4px', background: pinkAccentSubtle }} />
            </div>
            {/* Window sketch */}
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border-color)', alignSelf: 'center' }} />
          </div>

          {/* Skeleton Room 3: Kitchen & Dining */}
          <div
            className="skeleton-shimmer"
            style={{
              border: `1.5px solid ${pinkAccent}`,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animationDelay: '0.4s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '65px', height: '12px', borderRadius: '4px', background: textBarBg }} />
              <div style={{ width: '40px', height: '10px', borderRadius: '4px', background: pinkAccentSubtle }} />
            </div>
            {/* Counter slab sketch */}
            <div style={{ width: '30px', height: '12px', border: '1px dashed var(--border-color)', borderRadius: '3px' }} />
          </div>

          {/* Skeleton Room 4: Bedroom 2 / Puja */}
          <div
            className="skeleton-shimmer"
            style={{
              border: `1.5px solid ${pinkAccent}`,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animationDelay: '0.6s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '75px', height: '12px', borderRadius: '4px', background: textBarBg }} />
              <div style={{ width: '45px', height: '10px', borderRadius: '4px', background: pinkAccentSubtle }} />
            </div>
            <div style={{ width: '24px', height: '24px', borderLeft: '1.5px solid var(--border-color)', borderBottom: '1.5px solid var(--border-color)', borderRadius: '0 0 0 24px', alignSelf: 'flex-end' }} />
          </div>

          {/* Mini Legend Skeleton overlay */}
          <div
            className="skeleton-shimmer"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '110px',
              height: '60px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ width: '40px', height: '8px', borderRadius: '3px', background: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }} />
            <div style={{ width: '70px', height: '6px', borderRadius: '2px', background: textBarBg }} />
            <div style={{ width: '60px', height: '6px', borderRadius: '2px', background: textBarBg }} />
          </div>

          {/* Compass Skeleton */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: 0.4,
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary-color)' }}>N</span>
            <div style={{ width: '2px', height: '16px', background: 'var(--primary-color)' }} />
          </div>
        </div>
      </div>

      {/* Floating Center Status Pill */}
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
              {mode === 'ai'
                ? 'AI Engine Synthesizing Layout'
                : isRebuilding
                ? 'Rebuilding 2D Floor Plan'
                : 'Generating Architectural Layout'}
            </span>
            <span style={{ display: 'inline-flex', gap: '3px', color: 'var(--primary-color)' }}>
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {mode === 'ai'
              ? 'Parsing prompt requirements, space sizing & circulation paths'
              : 'Calibrating site dimensions, setbacks & structural pillars'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
