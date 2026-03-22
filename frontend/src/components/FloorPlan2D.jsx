import React from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';

const FEET_TO_PX = 20;
const GRID_SIZE = FEET_TO_PX;

const FloorPlan2D = ({ layout, onRoomUpdate }) => {
  if (!layout || !layout.rooms) return null;

  const { plot, rooms } = layout;
  const setbacks = plot.setbacks || { top: 0, bottom: 0, left: 0, right: 0 };

  const handleDragEnd = (e, roomId) => {
    const node = e.target;

    const newX = Math.round(node.x() / GRID_SIZE) * GRID_SIZE;
    const newY = Math.round(node.y() / GRID_SIZE) * GRID_SIZE;

    const room = rooms.find((r) => r.id === roomId);

    const finalX = Math.max(setbacks.left * FEET_TO_PX, Math.min(newX, (plot.width - setbacks.right - room.width) * FEET_TO_PX));
    const finalY = Math.max(setbacks.top * FEET_TO_PX, Math.min(newY, (plot.height - setbacks.bottom - room.height) * FEET_TO_PX));

    node.position({ x: finalX, y: finalY });

    if (onRoomUpdate) {
      onRoomUpdate(roomId, { x: finalX / FEET_TO_PX, y: finalY / FEET_TO_PX });
    }
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



  const stageWidth = window.innerWidth - 450;
  const stageHeight = window.innerHeight - 150;
  const plotPxWidth = plot.width * FEET_TO_PX;
  const plotPxHeight = plot.height * FEET_TO_PX;
  const scale = Math.min(stageWidth / (plotPxWidth + 100), stageHeight / (plotPxHeight + 100), 1);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        draggable
      >
        <Layer>
          {}
          <Rect
            x={0}
            y={0}
            width={plot.width * FEET_TO_PX}
            height={plot.height * FEET_TO_PX}
            stroke="#cbd5e1"
            strokeWidth={2}
            fill="#ffffff"
            cornerRadius={4}
            shadowBlur={20}
            shadowOpacity={0.05}
          />

          {}
          <Rect
            x={setbacks.left * FEET_TO_PX}
            y={setbacks.top * FEET_TO_PX}
            width={(plot.width - setbacks.left - setbacks.right) * FEET_TO_PX}
            height={(plot.height - setbacks.top - setbacks.bottom) * FEET_TO_PX}
            stroke="var(--primary-color)"
            strokeWidth={1}
            dash={[8, 8]}
            fill="rgba(59, 130, 246, 0.02)"
          />

          {}
          <Text
            text={`N ↑ (${plot.orientation})`}
            x={plot.width * FEET_TO_PX - 80}
            y={-25}
            fontSize={14}
            fontStyle="bold"
            fill="var(--text-muted)"
          />

          {}
          {Array.from({ length: Math.ceil((plot.width * FEET_TO_PX) / GRID_SIZE) + 1 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * GRID_SIZE, 0, i * GRID_SIZE, plot.height * FEET_TO_PX]}
              stroke="#e2e8f0"
              strokeWidth={1}
              opacity={0.5}
            />
          ))}

          {}
          {rooms.map((room) => (
            <Group
              key={room.id}
              x={room.x * FEET_TO_PX}
              y={room.y * FEET_TO_PX}
              draggable
              onDragEnd={(e) => handleDragEnd(e, room.id)}
            >
              <Rect
                width={room.width * FEET_TO_PX}
                height={room.height * FEET_TO_PX}
                fill={getRoomColor(room.type)}
                stroke="#f8fafc"
                strokeWidth={2}
                cornerRadius={4}
                shadowBlur={10}
                shadowOpacity={0.3}
                opacity={0.85}
              />
              <Text
                text={room.type.toUpperCase()}
                width={room.width * FEET_TO_PX}
                height={room.height * FEET_TO_PX}
                verticalAlign="middle"
                align="center"
                fontSize={16}
                fontStyle="bold"
                fill="white"
                fontFamily="Inter"
                padding={10}
                shadowBlur={4}
                shadowColor="rgba(0,0,0,0.5)"
                shadowOffset={{ x: 1, y: 1 }}
                shadowOpacity={0.8}
              />
              <Text
                text={`${room.width}x${room.height} ft`}
                width={room.width * FEET_TO_PX}
                y={(room.height * FEET_TO_PX) - 24}
                align="center"
                fontSize={13}
                fontStyle="bold"
                fill="white"
                shadowBlur={4}
                shadowColor="rgba(0,0,0,0.5)"
                shadowOpacity={0.8}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default FloorPlan2D;
