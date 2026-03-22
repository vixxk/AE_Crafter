/**
 * Core layout generation logic for the floor plan generator.
 * This is a deterministic algorithm that places rooms in a grid-like or row-wise manner.
 */

const ROOM_TYPES = {
  BEDROOM: 'bedroom',
  LIVING_ROOM: 'living room',
  KITCHEN: 'kitchen',
  BATHROOM: 'bathroom',
  DINING: 'dining area',
  STUDY: 'study',
  GUEST_ROOM: 'guest room',
  BALCONY: 'balcony',
  GARAGE: 'garage'
};

const DEFAULT_MIN_SIZE = 3;
const DEFAULT_MARGIN = 0.5; // Reduced for precision

/**
 * Generates a floor plan layout based on user input.
 * Now supports real-life constraints like setbacks and orientation.
 */
function generateLayout(input) {
  const { 
    plot, 
    rooms: inputRooms, 
    setbacks = { top: 3, bottom: 3, left: 3, right: 3 },
    orientation = 'North' 
  } = input;
  
  const { width: plotWidth, height: plotHeight } = plot;

  // Calculate effective building area
  const startX = setbacks.left;
  const startY = setbacks.top;
  const buildWidth = plotWidth - setbacks.left - setbacks.right;
  const buildHeight = plotHeight - setbacks.top - setbacks.bottom;

  if (buildWidth < DEFAULT_MIN_SIZE || buildHeight < DEFAULT_MIN_SIZE) {
    throw new Error('Building area too small after applying setbacks.');
  }

  // 1. Prepare rooms
  const roomsToPlace = inputRooms.map((room, index) => ({
    id: room.id || `room-${index}`,
    type: room.type || ROOM_TYPES.BEDROOM,
    width: Math.max(room.width || 10, DEFAULT_MIN_SIZE),
    height: Math.max(room.height || 10, DEFAULT_MIN_SIZE),
    wallHeight: room.wallHeight || 10,
    isAttached: room.isAttached || false
  }));

  // 2. Sequential placement algorithm (Row-wise within setbacks)
  const placedRooms = [];
  let currentX = startX;
  let currentY = startY;
  let maxRowHeight = 0;

  for (const room of roomsToPlace) {
    // Check if room fits in the current row width
    if (currentX + room.width > startX + buildWidth) {
      // Move to a new row
      currentX = startX;
      currentY += maxRowHeight + DEFAULT_MARGIN;
      maxRowHeight = 0;
    }

    // Check if it fits in the plot height
    if (currentY + room.height > startY + buildHeight) {
      // Dynamic scaling to fit plot if possible
      room.height = Math.max(startY + buildHeight - currentY, DEFAULT_MIN_SIZE);
    }

    room.x = currentX;
    room.y = currentY;

    placedRooms.push(room);

    // Update state for next room
    currentX += room.width + DEFAULT_MARGIN;
    maxRowHeight = Math.max(maxRowHeight, room.height);
  }

  return {
    plot: { ...plot, setbacks, orientation },
    rooms: placedRooms,
    doors: [],
    windows: []
  };
}

module.exports = {
  generateLayout,
  ROOM_TYPES
};
