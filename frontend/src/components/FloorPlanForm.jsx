import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Box,
  RefreshCw,
  Layers,
  Maximize,
  Settings,
  Compass,
  ArrowRight
} from 'lucide-react';
import { getUnitConfig } from '../utils/units';

const ROOM_TYPES = [
  'Bedroom',
  'Living Room',
  'Kitchen',
  'Bathroom',
  'Dining Area',
  'Study',
  'Guest Room',
  'Puja Room',
  'Balcony',
  'Garage'
];

const FloorPlanForm = ({ onGenerate, isGenerating, unit = 'feet', onUnitChange }) => {
  const unitCfg = getUnitConfig(unit);
  const [mode, setMode] = useState('manual');
  const [plot, setPlot] = useState({ width: 42, height: 45 });
  const [setbacks, setSetbacks] = useState({ top: 3, bottom: 3, left: 3, right: 3 });
  const [orientation, setOrientation] = useState('North');
  const [rooms, setRooms] = useState([
    { id: '1', type: 'bedroom', width: 12, height: 12, wallHeight: 10 },
    { id: '2', type: 'bedroom', width: 12, height: 12, wallHeight: 10 },
    { id: '3', type: 'bedroom', width: 12, height: 12, wallHeight: 10 },
    { id: '4', type: 'kitchen', width: 12, height: 12, wallHeight: 10 },
    { id: '5', type: 'puja room', width: 10, height: 12, wallHeight: 10 },
  ]);

  const [newRoom, setNewRoom] = useState({
    type: 'bedroom',
    width: 12,
    height: 12,
    wallHeight: 10
  });

  const [requirements, setRequirements] = useState({
    numRooms: 'auto',
    entranceDirection: 'South',
    staircasePosition: 'middle',
    hasCorridor: true,
    hasParking: false,
    units: 'feet',
    numDoors: 'auto',
    numWindows: 'auto',
    numVentilators: 'auto'
  });

  const [aiPrompt, setAiPrompt] = useState('A 3BHK modern villa with an open kitchen, large living room facing North, and a master bedroom with attached balcony.');


  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      { ...newRoom, id: Math.random().toString(36).substr(2, 9) }
    ]);
  };

  const handleRemoveRoom = (id) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onGenerate({ plot, rooms, setbacks, orientation, requirements: { ...requirements, units: unit } });
  };

  const handleAIGenerate = () => {
    onGenerate({ plot, prompt: aiPrompt, setbacks, orientation, requirements: { ...requirements, units: unit } }, true);
  };


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/favicon.png"
            alt="AE-Crafter Logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 4px 14px var(--primary-glow)',
              flexShrink: 0,
            }}
          />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-color)', letterSpacing: '-0.8px', textTransform: 'uppercase' }}>AE-Crafter</h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: '800', letterSpacing: '1px' }}>ARCHITECTURAL ENGINE</span>
          </div>
        </div>
      </div>

      <div className="mode-tabs" style={{ display: 'flex', padding: '0 20px', gap: '10px', marginBottom: '10px' }}>
        <button
          className={`tab-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: mode === 'manual' ? 'none' : '1px solid var(--border-color)',
            background: mode === 'manual' ? 'var(--primary-color)' : 'var(--input-bg)',
            color: mode === 'manual' ? 'white' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          Manual Design
        </button>
        <button
          className={`tab-btn ${mode === 'ai' ? 'active' : ''}`}
          onClick={() => setMode('ai')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: mode === 'ai' ? 'none' : '1px solid var(--border-color)',
            background: mode === 'ai' ? 'var(--primary-color)' : 'var(--input-bg)',
            color: mode === 'ai' ? 'white' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          AI Brain
        </button>
      </div>

      <div className="sidebar-content">
        <section>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Site Parameters
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>Unit of Measurement</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px',
                background: 'var(--input-bg)',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
              }}
            >
              {[
                { id: 'feet', label: 'Feet' },
                { id: 'meters', label: 'Meters' },
                { id: 'inches', label: 'Inches' },
                { id: 'yards', label: 'Yards' },
              ].map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onUnitChange && onUnitChange(u.id)}
                  style={{
                    padding: '6px 2px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    borderRadius: '7px',
                    border: 'none',
                    background: unit === u.id ? 'var(--primary-color)' : 'transparent',
                    color: unit === u.id ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>North Orientation</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select value={orientation} onChange={(e) => setOrientation(e.target.value)}>
                <option value="North">North (Top)</option>
                <option value="East">East (Right)</option>
                <option value="South">South (Bottom)</option>
                <option value="West">West (Left)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Plot Area ({unitCfg.areaSymbol})</label>
            <input
              type="number"
              step="any"
              value={Math.round(unitCfg.toUnit(plot.width) * unitCfg.toUnit(plot.height))}
              onChange={(e) => {
                const area = Number(e.target.value);
                const w = Math.sqrt(area * 1.25);
                const h = area / w;
                setPlot({ width: unitCfg.fromUnit(w), height: unitCfg.fromUnit(h) });
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Width ({unitCfg.symbol})</label>
              <input
                type="number"
                step="any"
                value={unitCfg.toUnit(plot.width)}
                onChange={(e) => setPlot({ ...plot, width: unitCfg.fromUnit(Number(e.target.value)) })}
              />
            </div>
            <div className="form-group">
              <label>Height ({unitCfg.symbol})</label>
              <input
                type="number"
                step="any"
                value={unitCfg.toUnit(plot.height)}
                onChange={(e) => setPlot({ ...plot, height: unitCfg.fromUnit(Number(e.target.value)) })}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Total Site Area: {Math.round(unitCfg.toUnit(plot.width) * unitCfg.toUnit(plot.height))} {unitCfg.areaSymbol}
          </div>
        </section>

        {mode === 'manual' ? (
          <>
            <section>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Component Library
              </div>
              <div style={{ background: 'var(--card-bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <label>Space Category</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  style={{ marginBottom: '16px' }}
                >
                  {ROOM_TYPES.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Width ({unitCfg.symbol})</label>
                    <input
                      type="number"
                      step="any"
                      value={unitCfg.toUnit(newRoom.width)}
                      onChange={(e) => setNewRoom({ ...newRoom, width: unitCfg.fromUnit(Number(e.target.value)) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Height ({unitCfg.symbol})</label>
                    <input
                      type="number"
                      step="any"
                      value={unitCfg.toUnit(newRoom.height)}
                      onChange={(e) => setNewRoom({ ...newRoom, height: unitCfg.fromUnit(Number(e.target.value)) })}
                    />
                  </div>
                </div>

                <button className="btn btn-secondary" onClick={handleAddRoom}>
                  <Plus size={18} /> Add Component
                </button>
              </div>
            </section>

            <section>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Room Inventory
              </div>
              {isGenerating ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="room-list-item skeleton-shimmer"
                      style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        opacity: 0.85,
                        animationDelay: `${(i - 1) * 0.15}s`,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ width: '90px', height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)' }} />
                        <div style={{ width: '50px', height: '9px', borderRadius: '3px', background: 'rgba(244, 114, 182, 0.25)' }} />
                      </div>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.04)' }} />
                    </div>
                  ))}
                </div>
              ) : (
                rooms.map(room => (
                  <div key={room.id} className="room-list-item">
                    <div className="room-info">
                      <span className="room-name">{room.type}</span>
                      <span className="room-details">{unitCfg.toUnit(room.width)} × {unitCfg.toUnit(room.height)} {unitCfg.symbol}</span>
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveRoom(room.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </section>
          </>
        ) : (
          <section>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI Prompt
            </div>
            <div style={{ background: 'var(--card-bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <label>Detailed Request</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g. A spacious 2 bedroom house with a central hall..."
                style={{
                  width: '100%',
                  height: '100px',
                  background: 'var(--input-bg)',
                  border: '1.5px solid var(--input-border)',
                  borderRadius: '12px',
                  color: 'var(--text-color)',
                  padding: '12px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  resize: 'none',
                  marginBottom: '10px'
                }}
              />
              {/* Tip removed for UI clarity */}
              {isGenerating && (
                <div
                  className="skeleton-shimmer"
                  style={{
                    marginTop: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary-color)',
                      boxShadow: '0 0 8px var(--primary-color)'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-color)', fontWeight: '600' }}>
                    AI Synthesizing room layout & orientation...
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="sidebar-footer">
        {mode === 'manual' ? (
          <button
            className={`btn btn-primary ${isGenerating ? 'is-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isGenerating}
          >
            <RefreshCw size={18} className={isGenerating ? 'spin' : ''} />
            {isGenerating ? 'Rebuilding Layout...' : 'Rebuild Layout'}
          </button>
        ) : (
          <button
            className={`btn btn-primary ${isGenerating ? 'is-loading' : ''}`}
            onClick={handleAIGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="spin" /> Synthesizing Layout...
              </>
            ) : (
              <>
                <Compass size={18} /> Generate with AI
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FloorPlanForm;
