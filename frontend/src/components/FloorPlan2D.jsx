import React, { useMemo, useState } from 'react';
import { Stage, Layer, Rect, Text, Group, Line, Arc, Arrow } from 'react-konva';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

const FEET_TO_PX = 20;
const WALL_THICKNESS = 2.5;
const PILLAR_SIZE = 10;
const DIM_OFFSET = 55;
const DIM_TICK = 8;
const FONT_FAMILY = 'Outfit, Arial, sans-serif';

const FloorPlan2D = ({ layout, theme = 'dark' }) => {
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  if (!layout || !layout.rooms) return null;

  const isDark = theme !== 'light';
  const WALL_COLOR = isDark ? '#f472b6' : '#059669';
  const SHEET_BG = isDark ? '#111116' : '#ffffff';
  const SHEET_BORDER = isDark ? 'rgba(244, 114, 182, 0.25)' : '#e4e4e7';
  const SETBACK_COLOR = isDark ? 'rgba(244, 114, 182, 0.45)' : '#cbd5e1';
  const CUTOUT_FILL = SHEET_BG;

  const { plot, rooms, components = [], entry } = layout;
  const setbacks = plot.setbacks || { top: 0, bottom: 0, left: 0, right: 0 };

  const stageWidth = window.innerWidth - 450;
  const stageHeight = window.innerHeight - 150;
  const plotPxWidth = plot.width * FEET_TO_PX;
  const plotPxHeight = plot.height * FEET_TO_PX;

  // Auto-scale to fit
  const padding = 200;
  const scale = Math.min(
    stageWidth / (plotPxWidth + padding),
    stageHeight / (plotPxHeight + padding),
    1.2
  );
  const offsetX = 120;
  const offsetY = 100;

  // ─── Compute building envelope ────────────────────────────────────
  const buildEnvelope = useMemo(() => {
    if (rooms.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const r of rooms) {
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.width);
      maxY = Math.max(maxY, r.y + r.height);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [rooms]);

  // ─── Compute corners for pillars ──────────────────────────────────
  const pillarCorners = useMemo(() => {
    const corners = new Set();
    rooms.forEach(r => {
      const x = r.x, y = r.y, w = r.width, h = r.height;
      corners.add(`${x},${y}`);
      corners.add(`${x + w},${y}`);
      corners.add(`${x},${y + h}`);
      corners.add(`${x + w},${y + h}`);
    });
    return Array.from(corners).map(c => {
      const [cx, cy] = c.split(',').map(Number);
      return { x: cx, y: cy };
    });
  }, [rooms]);

  // ─── Compute right side dimension (building height on right) ──────
  const rightDimension = useMemo(() => {
    if (!buildEnvelope) return null;
    // Find rooms on the right edge
    const rightEdge = buildEnvelope.x + buildEnvelope.width;
    const rightRooms = rooms.filter(r => Math.abs(r.x + r.width - rightEdge) < 1);
    if (rightRooms.length === 0) return null;

    // Calculate the height of rooms on the right side
    let minY = Infinity, maxY = -Infinity;
    rightRooms.forEach(r => {
      minY = Math.min(minY, r.y);
      maxY = Math.max(maxY, r.y + r.height);
    });

    return {
      y1: minY,
      y2: maxY,
      height: maxY - minY,
      x: rightEdge,
    };
  }, [rooms, buildEnvelope]);

  // ─── Render Staircase ─────────────────────────────────────────────
  const renderStaircase = (room) => {
    const steps = 14;
    const stepH = (room.height * FEET_TO_PX) / steps;
    const midX = (room.width * FEET_TO_PX) / 2;
    const roomW = room.width * FEET_TO_PX;
    const roomH = room.height * FEET_TO_PX;

    return (
      <Group key={room.id} x={room.x * FEET_TO_PX} y={room.y * FEET_TO_PX}>
        <Rect width={roomW} height={roomH} stroke={WALL_COLOR} strokeWidth={WALL_THICKNESS} fill={SHEET_BG} />
        {Array.from({ length: steps }).map((_, i) => (
          <Line
            key={`step-${i}`}
            points={[0, i * stepH, roomW, i * stepH]}
            stroke={WALL_COLOR}
            strokeWidth={0.8}
          />
        ))}
        <Line points={[midX, 0, midX, roomH]} stroke={WALL_COLOR} strokeWidth={1.5} />
        {/* Up arrow */}
        <Group x={midX / 2} y={roomH - 20}>
          <Line points={[0, 15, 0, 0]} stroke={WALL_COLOR} strokeWidth={2} />
          <Line points={[-5, 8, 0, 0, 5, 8]} stroke={WALL_COLOR} strokeWidth={2} closed fill={WALL_COLOR} />
        </Group>
        {/* Down arrow */}
        <Group x={midX + midX / 2} y={5}>
          <Line points={[0, 0, 0, 15]} stroke={WALL_COLOR} strokeWidth={2} />
          <Line points={[-5, 7, 0, 15, 5, 7]} stroke={WALL_COLOR} strokeWidth={2} closed fill={WALL_COLOR} />
        </Group>
      </Group>
    );
  };

  // ─── Render Kitchen Slab ──────────────────────────────────────────
  const renderKitchenSlab = (room) => {
    const roomW = room.width * FEET_TO_PX;
    const roomH = room.height * FEET_TO_PX;
    const slabW = 15;
    const slabH = roomH * 0.65;
    const sinkSize = 12;

    return (
      <Group>
        {/* Kitchen counter/slab along right wall */}
        <Rect
          x={roomW - slabW - 2}
          y={3}
          width={slabW}
          height={slabH}
          stroke={WALL_COLOR}
          strokeWidth={1.5}
        />
        {/* Sink symbol */}
        <Rect
          x={roomW - slabW + 1}
          y={slabH - sinkSize - 8}
          width={sinkSize}
          height={sinkSize}
          stroke={WALL_COLOR}
          strokeWidth={1}
          cornerRadius={2}
        />
        {/* Drain circle */}
        <Arc
          x={roomW - slabW + 1 + sinkSize / 2}
          y={slabH - sinkSize / 2 - 2}
          innerRadius={0}
          outerRadius={3}
          angle={360}
          fill={WALL_COLOR}
        />
        {/* KITCHEN SLAB text (vertical) */}
        <Text
          text="KITCHEN SLAB"
          x={roomW + 3}
          y={slabH / 2 + 35}
          fontSize={10}
          fill={WALL_COLOR}
          fontStyle="bold"
          fontFamily={FONT_FAMILY}
          rotation={-90}
        />
      </Group>
    );
  };

  // ─── Render Door Component ────────────────────────────────────────
  const renderDoor = (comp, index) => {
    const pxX = comp.x * FEET_TO_PX;
    const pxY = comp.y * FEET_TO_PX;
    const doorW = (comp.width || 3) * FEET_TO_PX;
    const isMain = comp.label === 'D1';
    const actualW = isMain ? doorW : doorW;

    if (comp.orientation === 'vertical') {
      return (
        <Group key={`door-${index}`} x={pxX} y={pxY}>
          {/* Door gap (clear wall) */}
          <Rect x={-3} y={0} width={6} height={actualW} fill={CUTOUT_FILL} />
          {/* Door leaf line */}
          <Line points={[0, 0, 0, actualW]} stroke={WALL_COLOR} strokeWidth={1.5} />
          {/* Swing arc */}
          <Arc
            x={0}
            y={0}
            angle={90}
            rotation={0}
            innerRadius={0}
            outerRadius={actualW}
            stroke={WALL_COLOR}
            strokeWidth={1}
            clockwise={false}
          />
          {/* Label */}
          <Text
            text={comp.label || 'D'}
            x={-15}
            y={actualW / 2 - 5}
            fontSize={11}
            fill={WALL_COLOR}
            fontStyle="bold"
            fontFamily={FONT_FAMILY}
          />
        </Group>
      );
    }

    // Horizontal door
    return (
      <Group key={`door-${index}`} x={pxX} y={pxY}>
        {/* Door gap */}
        <Rect x={0} y={-3} width={actualW} height={6} fill={CUTOUT_FILL} />
        {/* Door leaf line */}
        <Line points={[0, 0, actualW, 0]} stroke={WALL_COLOR} strokeWidth={1.5} />
        {/* Swing arc */}
        <Arc
          x={0}
          y={0}
          angle={90}
          rotation={0}
          innerRadius={0}
          outerRadius={actualW}
          stroke={WALL_COLOR}
          strokeWidth={1}
          clockwise={false}
        />
        {/* Label */}
        <Text
          text={comp.label || 'D'}
          x={actualW / 2 - 5}
          y={-15}
          fontSize={11}
          fill={WALL_COLOR}
          fontStyle="bold"
          fontFamily={FONT_FAMILY}
        />
      </Group>
    );
  };

  // ─── Render Window Component ──────────────────────────────────────
  const renderWindow = (comp, index) => {
    const pxX = comp.x * FEET_TO_PX;
    const pxY = comp.y * FEET_TO_PX;
    const winLen = (comp.width || 3.5) * FEET_TO_PX;
    const winDepth = 6;

    if (comp.orientation === 'vertical') {
      return (
        <Group key={`win-${index}`} x={pxX} y={pxY}>
          {/* Window frame */}
          <Rect
            x={-winDepth / 2}
            y={0}
            width={winDepth}
            height={winLen}
            fill={CUTOUT_FILL}
            stroke={WALL_COLOR}
            strokeWidth={1.5}
          />
          {/* Glass line */}
          <Line points={[0, 0, 0, winLen]} stroke={WALL_COLOR} strokeWidth={1} />
          {/* Ticks at ends */}
          <Line points={[-winDepth / 2, 0, winDepth / 2, 0]} stroke={WALL_COLOR} strokeWidth={1} />
          <Line points={[-winDepth / 2, winLen, winDepth / 2, winLen]} stroke={WALL_COLOR} strokeWidth={1} />
        </Group>
      );
    }

    // Horizontal window
    return (
      <Group key={`win-${index}`} x={pxX} y={pxY}>
        <Rect
          x={0}
          y={-winDepth / 2}
          width={winLen}
          height={winDepth}
          fill={CUTOUT_FILL}
          stroke={WALL_COLOR}
          strokeWidth={1.5}
        />
        <Line points={[0, 0, winLen, 0]} stroke={WALL_COLOR} strokeWidth={1} />
        <Line points={[0, -winDepth / 2, 0, winDepth / 2]} stroke={WALL_COLOR} strokeWidth={1} />
        <Line points={[winLen, -winDepth / 2, winLen, winDepth / 2]} stroke={WALL_COLOR} strokeWidth={1} />
      </Group>
    );
  };

  // ─── Render Ventilator Component ──────────────────────────────────
  const renderVentilator = (comp, index) => {
    const pxX = comp.x * FEET_TO_PX;
    const pxY = comp.y * FEET_TO_PX;
    const ventLen = (comp.width || 2) * FEET_TO_PX;
    const ventDepth = 4;

    if (comp.orientation === 'vertical') {
      return (
        <Group key={`vent-${index}`} x={pxX} y={pxY}>
          <Rect x={-ventDepth / 2} y={0} width={ventDepth} height={ventLen} fill={CUTOUT_FILL} stroke={WALL_COLOR} strokeWidth={1} />
          <Line points={[0, 0, 0, ventLen]} stroke={WALL_COLOR} strokeWidth={0.8} dash={[2, 2]} />
          <Text text="V" x={-ventDepth - 6} y={ventLen / 2 - 5} fontSize={10} fill={WALL_COLOR} fontStyle="bold" fontFamily={FONT_FAMILY} />
        </Group>
      );
    }

    return (
      <Group key={`vent-${index}`} x={pxX} y={pxY}>
        <Rect x={0} y={-ventDepth / 2} width={ventLen} height={ventDepth} fill={CUTOUT_FILL} stroke={WALL_COLOR} strokeWidth={1} />
        <Line points={[0, 0, ventLen, 0]} stroke={WALL_COLOR} strokeWidth={0.8} dash={[2, 2]} />
        <Text text="V" x={ventLen / 2 - 4} y={-ventDepth - 10} fontSize={10} fill={WALL_COLOR} fontStyle="bold" fontFamily={FONT_FAMILY} />
      </Group>
    );
  };

  // ─── Render Component (dispatcher) ────────────────────────────────
  const renderComponent = (comp, index) => {
    if (comp.type === 'door') return renderDoor(comp, index);
    if (comp.type === 'window') return renderWindow(comp, index);
    if (comp.type === 'ventilator') return renderVentilator(comp, index);
    return null;
  };

  // ─── Dimension line helper ────────────────────────────────────────
  const DimensionLine = ({ x1, y1, x2, y2, label, outside = 'top', offset = DIM_OFFSET }) => {
    const isHorizontal = Math.abs(y1 - y2) < 1;

    if (isHorizontal) {
      const dy = outside === 'top' ? -offset : offset;
      const tickDir = outside === 'top' ? -1 : 1;
      const textY = outside === 'top' ? dy - 22 : dy + 6;
      return (
        <Group>
          {/* Main line */}
          <Line points={[x1, y1 + dy, x2, y2 + dy]} stroke={WALL_COLOR} strokeWidth={1} />
          {/* End ticks */}
          <Line points={[x1, y1 + dy - DIM_TICK / 2, x1, y1 + dy + DIM_TICK / 2]} stroke={WALL_COLOR} strokeWidth={1} />
          <Line points={[x2, y2 + dy - DIM_TICK / 2, x2, y2 + dy + DIM_TICK / 2]} stroke={WALL_COLOR} strokeWidth={1} />
          {/* Extension lines */}
          <Line points={[x1, y1, x1, y1 + dy + tickDir * 3]} stroke={WALL_COLOR} strokeWidth={0.5} dash={[3, 3]} />
          <Line points={[x2, y2, x2, y2 + dy + tickDir * 3]} stroke={WALL_COLOR} strokeWidth={0.5} dash={[3, 3]} />
          {/* Label */}
          <Text
            text={label}
            x={(x1 + x2) / 2 - 20}
            y={y1 + textY}
            fontSize={24}
            fontStyle="bold"
            fill={WALL_COLOR}
            fontFamily={FONT_FAMILY}
            align="center"
            width={40}
          />
        </Group>
      );
    }

    // Vertical dimension
    const dx = outside === 'left' ? -offset : offset;
    const tickDir = outside === 'left' ? -1 : 1;
    const textX = outside === 'left' ? dx - 18 : dx + 8;
    return (
      <Group>
        <Line points={[x1 + dx, y1, x2 + dx, y2]} stroke={WALL_COLOR} strokeWidth={1} />
        <Line points={[x1 + dx - DIM_TICK / 2, y1, x1 + dx + DIM_TICK / 2, y1]} stroke={WALL_COLOR} strokeWidth={1} />
        <Line points={[x2 + dx - DIM_TICK / 2, y2, x2 + dx + DIM_TICK / 2, y2]} stroke={WALL_COLOR} strokeWidth={1} />
        <Line points={[x1, y1, x1 + dx + tickDir * 3, y1]} stroke={WALL_COLOR} strokeWidth={0.5} dash={[3, 3]} />
        <Line points={[x2, y2, x2 + dx + tickDir * 3, y2]} stroke={WALL_COLOR} strokeWidth={0.5} dash={[3, 3]} />
        <Text
          text={label}
          x={x1 + textX}
          y={(y1 + y2) / 2 + 20}
          fontSize={24}
          fontStyle="bold"
          fill={WALL_COLOR}
          fontFamily={FONT_FAMILY}
          rotation={-90}
        />
      </Group>
    );
  };

  if (!buildEnvelope) return null;

  const envPxX = buildEnvelope.x * FEET_TO_PX;
  const envPxY = buildEnvelope.y * FEET_TO_PX;
  const envPxW = buildEnvelope.width * FEET_TO_PX;
  const envPxH = buildEnvelope.height * FEET_TO_PX;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--canvas-bg)', overflow: 'hidden' }}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        draggable
      >
        <Layer x={offsetX} y={offsetY}>
          {/* ─── Plot Boundary (outer) ─────────────────────────────── */}
          <Rect
            width={plotPxWidth}
            height={plotPxHeight}
            fill={SHEET_BG}
            stroke={SHEET_BORDER}
            strokeWidth={1}
          />

          {/* ─── Setback Boundary (dashed) ─────────────────────────── */}
          <Rect
            x={setbacks.left * FEET_TO_PX}
            y={setbacks.top * FEET_TO_PX}
            width={(plot.width - setbacks.left - setbacks.right) * FEET_TO_PX}
            height={(plot.height - setbacks.top - setbacks.bottom) * FEET_TO_PX}
            stroke={SETBACK_COLOR}
            strokeWidth={0.8}
            dash={[6, 4]}
          />

          {/* ─── Building Envelope Outline ──────────────────────────── */}
          <Rect
            x={envPxX}
            y={envPxY}
            width={envPxW}
            height={envPxH}
            stroke={WALL_COLOR}
            strokeWidth={3}
            fill="transparent"
          />

          {/* ─── Dimension Lines ────────────────────────────────────── */}
          {/* Top: Full Plot width */}
          <DimensionLine
            x1={0}
            y1={0}
            x2={plotPxWidth}
            y2={0}
            label={plot.width.toString()}
            outside="top"
            offset={DIM_OFFSET}
          />

          {/* Left: Full Plot height */}
          <DimensionLine
            x1={0}
            y1={0}
            x2={0}
            y2={plotPxHeight}
            label={plot.height.toString()}
            outside="left"
            offset={DIM_OFFSET}
          />

          {/* Right: Inner height (if different from full) */}
          {rightDimension && (
            <DimensionLine
              x1={rightDimension.x * FEET_TO_PX}
              y1={rightDimension.y1 * FEET_TO_PX}
              x2={rightDimension.x * FEET_TO_PX}
              y2={rightDimension.y2 * FEET_TO_PX}
              label={rightDimension.height.toString()}
              outside="right"
              offset={DIM_OFFSET}
            />
          )}

          {/* ─── Pillar Squares at Wall Intersections ──────────────── */}
          {pillarCorners.map((p, i) => (
            <Rect
              key={`pillar-${i}`}
              x={p.x * FEET_TO_PX - PILLAR_SIZE / 2}
              y={p.y * FEET_TO_PX - PILLAR_SIZE / 2}
              width={PILLAR_SIZE}
              height={PILLAR_SIZE}
              fill={WALL_COLOR}
              stroke={WALL_COLOR}
              strokeWidth={0.5}
            />
          ))}

          {/* ─── Rooms ─────────────────────────────────────────────── */}
          {rooms.map((room) => {
            if (room.type === 'staircase') return renderStaircase(room);

            const roomW = room.width * FEET_TO_PX;
            const roomH = room.height * FEET_TO_PX;
            const isVertical = room.height >= room.width * 1.5;
            const labelW = isVertical ? roomH : roomW;
            const fontSizeTitle = Math.max(10, Math.min(14, labelW / 7));
            const fontSizeDim = Math.max(9, Math.min(12, labelW / 9));

            return (
              <Group key={room.id} x={room.x * FEET_TO_PX} y={room.y * FEET_TO_PX}>
                <Rect
                  width={roomW}
                  height={roomH}
                  stroke={WALL_COLOR}
                  strokeWidth={WALL_THICKNESS}
                  fill={room.type === 'corridor' ? (isDark ? '#1a1a22' : '#fffbfc') : room.type === 'parking' ? (isDark ? '#15151c' : '#fef9fa') : 'transparent'}
                />

                {/* Kitchen slab detail */}
                {room.type === 'kitchen' && renderKitchenSlab(room)}

                {/* Room label */}
                <Group x={roomW / 2} y={roomH / 2} rotation={isVertical ? -90 : 0}>
                  <Text
                    text={room.type.replace(/_/g, ' ').toUpperCase()}
                    align="center"
                    fontSize={fontSizeTitle}
                    fontStyle="900"
                    fill={WALL_COLOR}
                    fontFamily={FONT_FAMILY}
                    width={labelW - 8}
                    offsetX={(labelW - 8) / 2}
                    y={-fontSizeTitle - 2}
                  />
                  <Text
                    text={`${room.width}FT X ${room.height}FT.`}
                    align="center"
                    fontSize={fontSizeDim}
                    fill={WALL_COLOR}
                    fontFamily={FONT_FAMILY}
                    width={labelW - 8}
                    offsetX={(labelW - 8) / 2}
                    y={4}
                  />
                </Group>
              </Group>
            );
          })}

          {/* ─── Components (Doors / Windows / Ventilators) ─────────── */}
          {components.map((comp, i) => renderComponent(comp, i))}

          {/* ─── Entry Point ───────────────────────────────────────── */}
          {entry && (
            <Group x={entry.x * FEET_TO_PX} y={entry.y * FEET_TO_PX}>
              {/* Entry arrows */}
              {(entry.direction === 'South' || entry.direction === 'North') && (
                <Group>
                  {/* Left arrow */}
                  <Line
                    points={entry.direction === 'South'
                      ? [-30, 0, -30, 20, -20, 10]
                      : [-30, 0, -30, -20, -20, -10]}
                    stroke={WALL_COLOR}
                    strokeWidth={2}
                  />
                  {/* Right arrow */}
                  <Line
                    points={entry.direction === 'South'
                      ? [30, 0, 30, 20, 20, 10]
                      : [30, 0, 30, -20, 20, -10]}
                    stroke={WALL_COLOR}
                    strokeWidth={2}
                  />
                </Group>
              )}
              {/* ENTRY text */}
              <Text
                text="ENTRY"
                fontSize={26}
                fontStyle="900"
                fill={WALL_COLOR}
                fontFamily={FONT_FAMILY}
                x={entry.direction === 'South' || entry.direction === 'North' ? -36 : 15}
                y={entry.direction === 'South' ? 25 : entry.direction === 'North' ? -50 : -13}
              />
            </Group>
          )}

          {/* ─── North Compass Indicator ───────────────────────────── */}
          <Group
            x={envPxX + envPxW + 50}
            y={envPxY + envPxH - 10}
          >
            <Text
              text="N"
              fontSize={28}
              fontStyle="bold"
              fill={WALL_COLOR}
              fontFamily={FONT_FAMILY}
              x={8}
              y={-45}
            />
            {/* Arrow pointing up (North) */}
            <Line
              points={[18, -15, 18, 30]}
              stroke={WALL_COLOR}
              strokeWidth={3}
            />
            <Line
              points={[8, 0, 18, -15, 28, 0]}
              fill={WALL_COLOR}
              stroke={WALL_COLOR}
              strokeWidth={2}
              closed
            />
          </Group>

          {/* Title block removed for UI clarity - now handled in PDF export */}

        </Layer>
      </Stage>

      {/* ─── Legend Panel Aside from the diagram (Black & White) ────── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: isDark ? 'rgba(17, 17, 22, 0.92)' : 'rgba(255, 255, 255, 0.96)',
          border: `1.5px solid ${isDark ? 'rgba(244, 114, 182, 0.4)' : '#000000'}`,
          borderRadius: '12px',
          padding: isLegendOpen ? '14px 18px' : '10px 16px',
          boxShadow: isDark
            ? '0 12px 30px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(244, 114, 182, 0.15)'
            : '0 10px 25px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(12px)',
          zIndex: 40,
          minWidth: '220px',
          maxWidth: '260px',
          transition: 'all 0.25s ease',
          pointerEvents: 'auto',
          color: isDark ? '#ffffff' : '#000000',
        }}
      >
        <div
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color={isDark ? '#f472b6' : '#000000'} />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: '900',
                letterSpacing: '0.8px',
                color: isDark ? '#f472b6' : '#000000',
                textTransform: 'uppercase',
                fontFamily: FONT_FAMILY,
              }}
            >
              Plan Legend
            </span>
          </div>
          <button
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? '#f472b6' : '#000000',
              display: 'flex',
              padding: 0,
            }}
          >
            {isLegendOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {isLegendOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '9px',
              marginTop: '12px',
              borderTop: `1px solid ${isDark ? 'rgba(244, 114, 182, 0.25)' : 'rgba(0, 0, 0, 0.15)'}`,
              paddingTop: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    background: isDark ? '#f472b6' : '#000000',
                    color: isDark ? '#111116' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  D
                </span>
                <span style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '700' }}>Door (D)</span>
              </div>
              <span style={{ color: isDark ? '#a1a1aa' : '#52525b', fontSize: '0.72rem', fontWeight: '500' }}>7' × 3'</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    background: isDark ? '#f472b6' : '#000000',
                    color: isDark ? '#111116' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  D1
                </span>
                <span style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '700' }}>Main Door (D1)</span>
              </div>
              <span style={{ color: isDark ? '#a1a1aa' : '#52525b', fontSize: '0.72rem', fontWeight: '500' }}>7' × 4.5'</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    background: isDark ? '#f472b6' : '#000000',
                    color: isDark ? '#111116' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  W
                </span>
                <span style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '700' }}>Window (W)</span>
              </div>
              <span style={{ color: isDark ? '#a1a1aa' : '#52525b', fontSize: '0.72rem', fontWeight: '500' }}>4' × 3.2'</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    background: isDark ? '#f472b6' : '#000000',
                    color: isDark ? '#111116' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  V
                </span>
                <span style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '700' }}>Vent (V)</span>
              </div>
              <span style={{ color: isDark ? '#a1a1aa' : '#52525b', fontSize: '0.72rem', fontWeight: '500' }}>2' × 2'</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    background: isDark ? '#f472b6' : '#000000',
                    borderRadius: '2px',
                    marginLeft: '3px',
                  }}
                />
                <span style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '700', marginLeft: '3px' }}>Column Pillar</span>
              </div>
              <span style={{ color: isDark ? '#a1a1aa' : '#52525b', fontSize: '0.72rem', fontWeight: '500' }}>10" × 10"</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '16px',
                    height: '2px',
                    borderTop: `2px dashed ${isDark ? '#f472b6' : '#000000'}`,
                    marginLeft: '1px',
                  }}
                />
                <span style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '700', marginLeft: '1px' }}>Setback Line</span>
              </div>
              <span style={{ color: isDark ? '#a1a1aa' : '#52525b', fontSize: '0.72rem', fontWeight: '500' }}>Boundary</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorPlan2D;
