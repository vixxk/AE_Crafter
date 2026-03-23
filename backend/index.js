require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const { generateLayout } = require('../shared/layoutEngine');




const app = express();
const PORT = process.env.PORT || 5000;

let frontendOrigin = process.env.FRONTEND_URL || "*";
if (frontendOrigin !== "*" && frontendOrigin.endsWith('/')) {
  frontendOrigin = frontendOrigin.slice(0, -1);
}
app.use(cors({ origin: frontendOrigin }));
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
You are AE-Crafter's AI Brain. Your role is purely semantic architecture: analyze the user's description and requirements to decide EXACTLY which rooms are needed and their ideal sizes. 
A separate Geometric Engine will handle the physical placement, coordinate grid, and doors/windows.

Input Schema:
{
  "plot": { "width": number, "height": number, "orientation": string, "setbacks": ... },
  "prompt": "string",
  "requirements": { ... }
}

Output Schema (JSON ONLY!):
{
  "corridorWidth": number (optional, requested corridor width in ft, e.g. 4),
  "setbacks": { "top": number, "bottom": number, "left": number, "right": number } (optional, suggest setbacks to fit requirements within the plot!),
  "requirements": {
    "staircasePosition": "middle" | "side" | "none",
    "hasCorridor": boolean,
    "hasParking": boolean,
    "entranceDirection": "South" | "North" | "East" | "West"
  },
  "rooms": [
    { 
      "id": "string (unique)", 
      "type": "bedroom" | "living room" | "kitchen" | "bathroom" | "dining area" | "study" | "balcony" | "garage" | "guest room" | "puja room", 
      "width": number (ideal width in ft), 
      "height": number (ideal height in ft),
      "label": "string (IMPORTANT: For public/common bathrooms, use label 'COMMON BATHROOM' or 'LIVING ROOM BATHROOM' to prevent default ensuite pairing. For private ensuite bathrooms, use normal labels like 'MASTER BATH')"
    }
  ]
}

Rules:
1. Translate descriptions like "3BHK" into exactly 3 bedrooms, 1 living room, 1 kitchen, and bathrooms as specified.
2. DO NOT include "staircase", "corridor", or "parking" in your rooms array. The geometric engine automatically handles circulation/parking based on the requirements.
3. If requirements.numRooms is a number, create exactly that many rooms. If it is "auto", use your architectural expertise based on the prompt.
4. Provide realistic ideal widths and heights for rooms (e.g. 15x15 for Living, 12x12 for Bedrooms, 5x6 for Bathrooms).
5. ABSOLUTE PRIORITY: The user's specific prompt takes absolute precedence! If they request a specific staircase location (e.g. 'central'), explicitly output "staircasePosition": "middle" in requirements. If they specify exact room counts or dimensions, honor them without question.
`;

app.post('/api/generate', (req, res) => {
  try {
    const input = req.body;
    if (!input.plot || !input.rooms) {
      return res.status(400).json({ error: 'Plot dimensions and rooms list are required.' });
    }

    // Pass requirements from form to the layout engine
    const layoutInput = {
      ...input,
      requirements: input.requirements || {},
    };

    const layout = generateLayout(layoutInput);
    res.json(layout);
  } catch (err) {
    console.error('Layout generation error:', err);
    res.status(500).json({ error: 'An error occurred during layout generation.' });
  }
});


app.post('/api/ai-generate', async (req, res) => {
  if (!process.env.FIREWORKS_API_KEY) {
    return res.status(401).json({ error: 'Fireworks API Key not configured on server.' });
  }

  try {
    const { plot, prompt, setbacks, orientation, requirements } = req.body;
    const plotWithDetails = { ...plot, setbacks, orientation };
    const fullPrompt = `Plot Info: ${JSON.stringify(plotWithDetails)}\nRequirements: ${JSON.stringify(requirements)}\nUser Description: ${prompt}`;

    console.log('--- AI GENERATION START ---');
    console.log('Model:', MODEL);
    console.log('Prompt Length:', fullPrompt.length);

    const result = await fireworks.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    console.log('AI Response Received successfully');
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


    const currentSetbacks = layout.setbacks || setbacks || { top: 3, bottom: 3, left: 3, right: 3 };
    const maxBuildingWidth = plot.width - currentSetbacks.left - currentSetbacks.right;
    const maxBuildingHeight = plot.height - currentSetbacks.top - currentSetbacks.bottom;

    const correctedRooms = layout.rooms.map(room => ({
      ...room,
      id: room.id || Math.random().toString(36).substring(2, 9),
      width: Math.max(Math.min(room.width || 10, maxBuildingWidth), 3),
      height: Math.max(Math.min(room.height || 10, maxBuildingHeight), 3),
      wallHeight: room.wallHeight || 10,
      x: room.x || currentSetbacks.left,
      y: room.y || currentSetbacks.top,
      label: room.label || `${room.type.toUpperCase()} ${room.width}FT X ${room.height}FT`
    }));


    const engineInput = {
      plot,
      rooms: correctedRooms,
      setbacks: currentSetbacks,
      orientation: orientation || 'North',
      requirements: { ...requirements, ...(layout.requirements || {}), corridorWidth: layout.corridorWidth }
    };

    const finalLayout = generateLayout(engineInput);
    if (!finalLayout.feedback) {
      finalLayout.feedback = layout.feedback || "Geometrically optimized the AI semantic room choices for perfect structure.";
    }

    res.json(finalLayout);
  } catch (err) {
    console.error('AI Generation error:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
    
    let userMessage = 'AI failed to generate layout. Please try again.';
    if (err.message.includes('Connection error')) {
      userMessage = 'Connection to Fireworks AI timed out. Please check your internet connection or try again later.';
    }
    
    res.status(500).json({ error: userMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
