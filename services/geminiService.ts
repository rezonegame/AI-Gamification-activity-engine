

import { GoogleGenAI } from "@google/genai";

// This line assumes the API_KEY is exposed as an environment variable
// accessible in the frontend. In a real production app, this is a major
// security risk and a backend-for-frontend (BFF) pattern is strongly recommended
// to protect the key.
if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const defaultSystemInstruction = `You are a world-class expert consultant. Your task is to analyze the user's document and any previous design documents based on the provided instructions and generate a structured response. Ensure your response is coherent with the previous work and strictly follows the output format specified in the instructions.`;


export const generateDesignPrompt = async (
  userPRD: string,
  previousOutputs: { name: string; output: string }[],
  metaPrompt: string,
  onChunk: (chunk: string) => void,
  onLog?: (message: string) => void
): Promise<void> => {
  // A runtime check to provide a clear error to the user if the key is missing.
  if (!process.env.API_KEY) {
    throw new Error("API Key is not configured. Please ensure the API_KEY environment variable is set.");
  }
  
  try {
    if (!metaPrompt) {
      throw new Error("Invalid aspect selected: meta-prompt is missing.");
    }
    
    onLog?.('Preparing context and instructions...');

    const previousOutputsContext = previousOutputs
      .map(p => `--- PREVIOUS DOCUMENT: ${p.name.toUpperCase()} ---\n${p.output}\n\n`)
      .join('');

    const contextBlock = previousOutputsContext 
      ? `<PREVIOUS_DESIGN_DOCUMENTS>
${previousOutputsContext}</PREVIOUS_DESIGN_DOCUMENTS>`
      : '';
    
    // ONE-STEP PROCESS (for ALL aspects)
    onLog?.('Generating output...');
      
    const requestContent =`<TASK_INSTRUCTIONS>
${metaPrompt}
</TASK_INSTRUCTIONS>

${contextBlock}

<USER_DOCUMENT>
${userPRD}
</USER_DOCUMENT>`;

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: requestContent,
      config: {
        systemInstruction: defaultSystemInstruction,
      },
    });

    for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
            onChunk(chunkText);
        }
    }
    
  } catch (error) {
    console.error("Error in Gemini service call:", error);
    if (error instanceof Error) {
       // Re-throw a more user-friendly message for the UI to catch.
       throw new Error(`AI generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
