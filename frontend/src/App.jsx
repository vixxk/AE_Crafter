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
  Grid,
  Sun,
  Moon
} from 'lucide-react';
import FloorPlanForm from './components/FloorPlanForm';
import FloorPlan2D from './components/FloorPlan2D';
import FloorPlan3D from './components/FloorPlan3D';
import HomeSkeleton from './components/HomeSkeleton';
import ThreeDSkeleton from './components/ThreeDSkeleton';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GENERATE_URL = `${VITE_API_URL}/api/generate`;
const AI_GENERATE_URL = `${VITE_API_URL}/api/ai-generate`;

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ae_theme') || 'dark');
  const [layout, setLayout] = useState(null);
  const [view, setView] = useState('2D');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setGenerationMode] = useState('manual');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ae_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGenerate = async (input, isAI = false, isInitial = false) => {
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
      setTimeout(() => {
        setLoading(false);
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }, 500);
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


    setExporting(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 100));

      const doc = new jsPDF('p', 'mm', 'a4');
      const canvasArea = document.querySelector('.canvas-container');


      const canvas = await html2canvas(canvasArea, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');


      doc.setFontSize(22);
      doc.setTextColor(51, 65, 85);
      doc.text('AE-Crafter Architectural Report', 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 32);
      doc.text(`ID: ${layout.id || 'N/A'}`, 150, 32);


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


      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, 'PNG', 20, 75, imgWidth, imgHeight);


      // --- Formal Blueprint Title & Stamp Section ---
      const stampY = 75 + imgHeight + 20;

      // Plan Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('PLAN & ELEVATION FOR GROUND FLOOR', 105, stampY, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('ALL THE DIMENSIONS ARE IN FEET.', 105, stampY + 6, { align: 'center' });

      // Designer Stamp Box
      const boxW = 80;
      const boxH = 35;
      const boxX = 130;
      const boxY = stampY + 15;

      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxW, boxH);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('DESIGNED & PLANNED BY:', boxX + 5, boxY + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('AE-CRAFTER ENGINE', boxX + 5, boxY + 20);
      doc.setFontSize(8);
      doc.text('VIRTUAL ARCHITECTURAL AI SYSTEM', boxX + 5, boxY + 28);

      // Feedback / Insights Section (Moved to bottom of stamp area)
      if (layout.feedback) {
        const feedbackY = boxY + boxH + 15;
        doc.setFillColor(248, 250, 252);
        doc.rect(20, feedbackY - 5, 170, 25, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text('AE-CRAFTER ARCHITECTURAL INSIGHTS:', 25, feedbackY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(layout.feedback, 160);
        doc.text(splitText, 25, feedbackY + 7);
      }

      // Footer disclaimer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('This plan is AI-generated and should be verified by a certified architect before construction.', 105, 290, { align: 'center' });

      doc.save(`ae-crafter-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      setError('Could not generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };


  useEffect(() => {
    handleGenerate({
      plot: { width: 42, height: 45 },
      setbacks: { top: 3, bottom: 3, left: 3, right: 3 },
      orientation: 'North',
      rooms: [
        { id: '1', type: 'bedroom', width: 12, height: 12, wallHeight: 10 },
        { id: '2', type: 'bedroom', width: 12, height: 12, wallHeight: 10 },
        { id: '3', type: 'bedroom', width: 12, height: 12, wallHeight: 10 },
        { id: '4', type: 'kitchen', width: 12, height: 12, wallHeight: 10 },
        { id: '5', type: 'puja room', width: 10, height: 12, wallHeight: 10 },
      ],
      requirements: {
        entranceDirection: 'South',
        staircasePosition: 'middle',
        hasCorridor: true,
        hasParking: false,
        numDoors: 6,
        numWindows: 6,
        numVentilators: 1,
      }
    }, false, true);
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="view-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{
                padding: '8px 12px',
                background: 'var(--view-controls-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px'
              }}
            >
              {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#10b981" />}
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

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

            {layout && !loading && (
              <button
                className={`btn btn-primary ${exporting ? 'is-loading' : ''}`}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <RefreshCcw size={16} className="spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} /> Export PDF
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        <section className="canvas-container">
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

          {!error && isInitialLoading && (
            view === '2D' ? (
              <HomeSkeleton mode={mode} theme={theme} />
            ) : (
              <ThreeDSkeleton mode={mode} />
            )
          )}

          {!error && !isInitialLoading && layout && (
            <div className="canvas-fade-in" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {view === '2D' ? (
                <FloorPlan2D layout={layout} onRoomUpdate={handleUpdateRoom} theme={theme} />
              ) : (
                <FloorPlan3D layout={layout} theme={theme} />
              )}

              {loading && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
                  {view === '2D' ? (
                    <HomeSkeleton mode={mode} isRebuilding={true} theme={theme} />
                  ) : (
                    <ThreeDSkeleton mode={mode} />
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Interactive hint removed for UI clarity */}
      </main>
    </div>
  );
}

export default App;
