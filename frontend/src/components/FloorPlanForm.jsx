import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Home,
  Box,
  RefreshCw,
  Layers,
  Maximize,
  Settings,
  Compass,
  ArrowRight
} from 'lucide-react';

const ROOM_TYPES = [
  'Bedroom',
  'Living Room',
  'Kitchen',
  'Bathroom',
  'Dining Area',
  'Study',
  'Guest Room',
  'Balcony',
  'Garage'
];

const FloorPlanForm = ({ onGenerate, isGenerating }) => {
  const [mode, setMode] = useState('manual');
  const [plot, setPlot] = useState({ width: 50, height: 40 });
  const [setbacks, setSetbacks] = useState({ top: 3, bottom: 3, left: 3, right: 3 });
  const [orientation, setOrientation] = useState('North');
  const [rooms, setRooms] = useState([
    { id: '1', type: 'living room', width: 20, height: 18, wallHeight: 10 },
    { id: '2', type: 'bedroom', width: 15, height: 14, wallHeight: 10 },
    { id: '3', type: 'kitchen', width: 12, height: 14, wallHeight: 10 },
    { id: '4', type: 'bathroom', width: 8, height: 8, wallHeight: 10 }
  ]);

  const [newRoom, setNewRoom] = useState({
    type: 'bedroom',
    width: 12,
    height: 12,
    wallHeight: 10
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
    onGenerate({ plot, rooms, setbacks, orientation });
  };

  const handleAIGenerate = () => {
    onGenerate({ plot, prompt: aiPrompt, setbacks, orientation }, true);
  };


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-color)', padding: '10px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)' }}>
            <Home size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-color)', letterSpacing: '-0.8px', textTransform: 'uppercase' }}>AE-Crafter</h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: '800', letterSpacing: '1px' }}>V2.0 ARCHITECTURAL ENGINE</span>
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
            border: 'none',
            background: mode === 'manual' ? 'var(--primary-color)' : '#f1f5f9',
            color: mode === 'manual' ? 'white' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem'
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
            border: 'none',
            background: mode === 'ai' ? 'var(--primary-color)' : '#f1f5f9',
            color: mode === 'ai' ? 'white' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem'
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
            <label>Plot Area (sq ft)</label>
            <input
              type="number"
              value={plot.width * plot.height}
              onChange={(e) => {
                const area = Number(e.target.value);

                const w = Math.sqrt(area * 1.25);
                const h = area / w;
                setPlot({ width: Math.round(w), height: Math.round(h) });
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Width (ft)</label>
              <input type="number" value={plot.width} onChange={(e) => setPlot({ ...plot, width: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Height (ft)</label>
              <input type="number" value={plot.height} onChange={(e) => setPlot({ ...plot, height: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Total Site Area: {plot.width * plot.height} sq ft
          </div>
        </section>

        {mode === 'manual' ? (
          <>
            <section>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Component Library
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
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
                    <label>Width</label>
                    <input type="number" value={newRoom.width} onChange={(e) => setNewRoom({ ...newRoom, width: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Height</label>
                    <input type="number" value={newRoom.height} onChange={(e) => setNewRoom({ ...newRoom, height: Number(e.target.value) })} />
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
              {rooms.map(room => (
                <div key={room.id} className="room-list-item">
                  <div className="room-info">
                    <span className="room-name">{room.type}</span>
                    <span className="room-details">{room.width} x {room.height} ft</span>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveRoom(room.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </section>
          </>
        ) : (
          <section>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI Prompt
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <label>Detailed Request</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g. A spacious 2 bedroom house with a central hall..."
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text-color)',
                  padding: '12px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  resize: 'none',
                  marginBottom: '10px'
                }}
              />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: '500' }}>
                Tip: Mention floor count, room proximities, and specific dimensions for better results.
              </p>
            </div>
          </section>
        )}
      </div>

      <div className="sidebar-footer">
        {mode === 'manual' ? (
          <button className="btn btn-primary" onClick={handleSubmit}>
            <RefreshCw size={18} /> Rebuild Layout
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleAIGenerate}
            disabled={isGenerating}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Thinking...
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
