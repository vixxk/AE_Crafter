import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Download,
  Box,
  Layout,
  Layers,
  Info,
  RefreshCcw,
  Maximize,
  Database,
  Grid
} from 'lucide-react';
import FloorPlanForm from './components/FloorPlanForm';
import FloorPlan2D from './components/FloorPlan2D';
import FloorPlan3D from './components/FloorPlan3D';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const GENERATE_URL = 'http://localhost:5000/api/generate';
const AI_GENERATE_URL = 'http://localhost:5000/api/ai-generate';

function App() {
  const [layout, setLayout] = useState(null);
  const [view, setView] = useState('2D');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setGenerationMode] = useState('manual'); // 'manual' or 'ai'

  const handleGenerate = async (input, isAI = false) => {
    setLoading(true);
    setError(null);
    setGenerationMode(isAI ? 'ai' : 'manual');
    try {
      const url = isAI ? AI_GENERATE_URL : GENERATE_URL;
      const response = await axios.post(url, input);
      setLayout(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || 'Could not reach backend server. Please ensure node backend/index.js is running.');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };


  const handleUpdateRoom = (roomId, updates) => {
    setLayout(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, ...updates } : r)
    }));
  };

  const handleExport = async () => {
    if (!layout) return;

    // PDF Export (Unified for both Standard and AI modes)
    setExporting(true);
    try {
      // Small delay to ensure any open menus or states are settled
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const canvasArea = document.querySelector('.canvas-container');

      // Capture the diagram with better settings
      const canvas = await html2canvas(canvasArea, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');

      // PDF Header
      doc.setFontSize(22);
      doc.setTextColor(51, 65, 85);
      doc.text('AE-Crafter Architectural Report', 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 32);
      doc.text(`ID: ${layout.id || 'N/A'}`, 150, 32);

      // Site Info
      doc.setDrawColor(203, 213, 225);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'bold');
      doc.text('Site Parameters:', 20, 45);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text([
        `Area: ${layout.plot.width * layout.plot.height} sq ft`,
        `Dimensions: ${layout.plot.width}ft x ${layout.plot.height}ft`,
        `Orientation: Facing ${layout.plot.orientation}`,
        `Setbacks: T:${layout.plot.setbacks.top}ft, B:${layout.plot.setbacks.bottom}ft, L:${layout.plot.setbacks.left}ft, R:${layout.plot.setbacks.right}ft`
      ], 20, 52);

      // Image (Diagram)
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, 'PNG', 20, 75, imgWidth, imgHeight);

      // AI Suggestions
      if (layout.feedback) {
        const nextY = 75 + imgHeight + 15;
        doc.setFillColor(240, 249, 255);
        doc.rect(20, nextY - 5, 170, 25, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text('AE-Crafter Architectural Feedback:', 25, nextY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(layout.feedback, 160);
        doc.text(splitText, 25, nextY + 7);
      }

      // Final Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('This plan is AI-generated and should be verified by a certified architect before construction.', 105, 285, { align: 'center' });

      doc.save(`ae-crafter-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      setError('Could not generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Initial generation
  useEffect(() => {
    handleGenerate({
      plot: { width: 50, height: 40 },
      setbacks: { top: 3, bottom: 3, left: 3, right: 3 },
      orientation: 'North',
      rooms: [
        { id: '1', type: 'living room', width: 22, height: 20, wallHeight: 10 },
        { id: '2', type: 'bedroom', width: 15, height: 15, wallHeight: 10 },
        { id: '3', type: 'kitchen', width: 12, height: 15, wallHeight: 10 },
        { id: '4', type: 'bathroom', width: 8, height: 8, wallHeight: 10 }
      ]
    });
  }, []);

  return (
    <div className="app-container">
      <FloorPlanForm onGenerate={handleGenerate} isGenerating={loading} />


      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.8px', color: 'var(--text-color)', textTransform: 'uppercase' }}>
              AE-Crafter
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Grid size={12} /> Unit: Feet
              </span>
              <span style={{ fontSize: '12px', color: 'var(--border-color)' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Database size={12} /> Mode: {mode === 'ai' ? 'AI Enhanced' : 'Standard'}
              </span>
            </div>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${view === '2D' ? 'active' : ''}`}
              onClick={() => setView('2D')}
            >
              <Layout size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Plan View
            </button>
            <button
              className={`view-btn ${view === '3D' ? 'active' : ''}`}
              onClick={() => setView('3D')}
            >
              <Box size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              3D Render
            </button>
          </div>
        </header>

        <section className="canvas-container">
          {loading && (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p style={{ fontWeight: '600', color: 'var(--text-color)' }}>Generating...</p>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <Info size={48} color="#ef4444" />
              <h3 style={{ color: '#ef4444', marginTop: '10px' }}>Server Connectivity Error</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>{error}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && layout && (
            <>
              {layout.feedback && (
                <div style={{
                  margin: '16px',
                  padding: '12px 16px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  <Info size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>AE-Crafter Insights:</strong>
                    {layout.feedback}
                  </div>
                </div>
              )}
              {view === '2D' ? (
                <FloorPlan2D layout={layout} onRoomUpdate={handleUpdateRoom} />
              ) : (
                <FloorPlan3D layout={layout} />
              )}
            </>
          )}
        </section>

        {view === '2D' && (
          <div style={{
            padding: '12px 24px',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--primary-color)',
            background: '#f0f9ff',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Maximize size={16} />
            Interactive drag and drop structures according to your choice
          </div>
        )}

        {layout && !loading && (
          <button
            className="btn btn-primary export-json"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <RefreshCcw size={20} className="spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download size={20} /> Export Architectural PDF
              </>
            )}
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
