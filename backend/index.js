require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const { generateLayout } = require('../shared/layoutEngine');


function resolveOverlaps(rooms, plot, setbacks) {
  const sortedRooms = [...rooms].sort((a, b) => (a.y - b.y) || (a.x - b.x));
  const placed = [];

  const buildingArea = {
    minX: setbacks.left,
    maxX: plot.width - setbacks.right,
    minY: setbacks.top,
    maxY: plot.height - setbacks.bottom
  };

  for (const room of sortedRooms) {
    let attempts = 0;



    room.width = Math.max(1, Math.min(room.width, buildingArea.maxX - buildingArea.minX));
    room.height = Math.max(1, Math.min(room.height, buildingArea.maxY - buildingArea.minY));

    room.x = Math.max(buildingArea.minX, Math.min(room.x, buildingArea.maxX - room.width));
    room.y = Math.max(buildingArea.minY, Math.min(room.y, buildingArea.maxY - room.height));

    const checkOverlap = (r1, r2) => {
      const margin = 0.05;
      return !(r1.x + r1.width - margin <= r2.x ||
               r1.x >= r2.x + r2.width - margin ||
               r1.y + r1.height - margin <= r2.y ||
               r1.y >= r2.y + r2.height - margin);
    };

    while (placed.some(p => checkOverlap(room, p)) && attempts < 200) {

      room.x += 1;


      if (room.x + room.width > buildingArea.maxX) {
        room.x = buildingArea.minX;
        room.y += 1;
      }


      if (room.y + room.height > buildingArea.maxY) {


        room.y = buildingArea.maxY - room.height;
        break;
      }
      attempts++;
    }

    placed.push(room);
  }
  return placed;
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(bodyParser.json());


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy', timestamp: new Date().toISOString() });
});



const fireworks = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY || '',
  baseURL: 'https://api.fireworks.ai/inference/v1',
});
const MODEL = 'accounts/fireworks/models/llama-v3p3-70b-instruct';



const SYSTEM_PROMPT = `
You are AE-Crafter, a world-class architectural AI engine. Your task is to generate a structured 2D floor plan JSON based on a user's description.

Architectural Principles:
1. SPACE UTILIZATION (MAXIMIZE): Aim to use as much of the building area (plot minus setbacks) as possible. If the user does not specify room dimensions, you MUST increase room sizes to logical maximums (e.g., Living Room 25x20, Bedrooms 15x15) to cover the available area efficiently. Avoid leaving large empty spaces in the plot unless it's for a yard/garden.
2. ENTRANCE & ORIENTATION: Follow the North orientation for the entrance (Living Room focus).
3. ZONING & PROXIMITY: Kitchen near Dining, Master Bedroom with attached Bathroom.
4. VALIDATION: If the user request is physically impossible, generate a feasible layout but use the "feedback" field to explain why you adjusted sizes.
5. SUGGESTIONS: Provide 2-3 architectural suggestions in the "feedback" field.

Input Schema:
{
  "plot": { "width": number, "height": number, "orientation": string, "setbacks": { "top": number, "bottom": number, "left": number, "right": number } },
  "prompt": "string"
}

Output Schema (JSON):
{
  "plot": { "width": number, "height": number, "orientation": string, "setbacks": { "top": number, "bottom": number, "left": number, "right": number } },
  "rooms": [
    { "id": "string", "type": "bedroom" | "living room" | "kitchen" | "bathroom" | "dining area" | "study" | "balcony" | "garage", "x": number, "y": number, "width": number, "height": number, "wallHeight": number }
  ],
  "feedback": "A concise string containing errors, limitations, or architectural suggestions."
}

IMPORTANT: Respond ONLY with a valid JSON object. Do not include any explanations outside the JSON.
`;



app.post('/api/generate', (req, res) => {
  try {
    const input = req.body;
    if (!input.plot || !input.rooms) {
      return res.status(400).json({ error: 'Plot dimensions and rooms list are required.' });
    }
    const layout = generateLayout(input);
    res.json(layout);
  } catch (err) {
    console.error('Layout generation error:', err);
    res.status(500).json({ error: 'An error occurred during layout generation.' });
  }
});


app.post('/api/ai-generate', async (req, res) => {
  const { plot, prompt, setbacks, orientation } = req.body;

  if (!process.env.FIREWORKS_API_KEY) {
    return res.status(401).json({ error: 'Fireworks API Key not configured on server.' });
  }

  try {
    const plotWithDetails = { ...plot, setbacks, orientation };
    const fullPrompt = `Plot Info: ${JSON.stringify(plotWithDetails)}\nUser Description: ${prompt}`;

    const result = await fireworks.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    const responseText = result.choices[0].message.content;

    let layout;
    try {
      layout = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('Invalid JSON received from AI Brain.');
    }

    if (!layout || !Array.isArray(layout.rooms)) {
      console.error('AI response is missing rooms array:', layout);
      throw new Error('AI Brain returned a response without a valid room layout.');
    }


    const currentSetbacks = setbacks || { top: 3, bottom: 3, left: 3, right: 3 };
    const maxBuildingWidth = plot.width - currentSetbacks.left - currentSetbacks.right;
    const maxBuildingHeight = plot.height - currentSetbacks.top - currentSetbacks.bottom;

    const correctedRooms = layout.rooms.map(room => ({
      ...room,
      id: room.id || Math.random().toString(36).substring(2, 9),

      width: Math.max(Math.min(room.width || 10, maxBuildingWidth), 3),
      height: Math.max(Math.min(room.height || 10, maxBuildingHeight), 3),
      wallHeight: room.wallHeight || 10,
      x: room.x || currentSetbacks.left,
      y: room.y || currentSetbacks.top
    }));


    layout.rooms = resolveOverlaps(correctedRooms, plot, currentSetbacks);
    layout.plot = { ...plot, setbacks: currentSetbacks, orientation: orientation || 'North' };

    res.json(layout);
  } catch (err) {
    console.error('AI Generation error:', err);
    res.status(500).json({ error: 'AI failed to generate layout. Please try a more specific prompt.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

