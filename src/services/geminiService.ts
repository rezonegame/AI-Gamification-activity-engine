import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectId } from "../types.ts";

const defaultSystemInstruction = `You are a world-class expert consultant. Your task is to analyze the user's document and any previous design documents based on the provided instructions and generate a structured response. Ensure your response is coherent with the previous work and strictly follows the output format specified in the instructions.`;


export const generateDesignPrompt = async (
  userPRD: string,
  previousOutputs: { name: string; output: string }[],
  metaPrompt: string,
  aspectId: AspectId,
  onChunk: (chunk: GenerateContentResponse) => void,
  onLog?: (message: string) => void
): Promise<void> => {
  if (!process.env.API_KEY) {
    throw new Error('error.apiKeyNotConfigured');
  }
  
  // Initialize the AI client here, inside the function, to prevent app crash on load
  // if the API key is not available in the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    if (!metaPrompt) {
        throw new Error('error.metaPromptMissing');
    }
    
    onLog?.('Preparing context and instructions...');

    const previousOutputsContext = previousOutputs
      .map(p => `--- PREVIOUS DOCUMENT: ${p.name.toUpperCase()} ---\n${p.output}\n\n`)
      .join('');

    const contextBlock = previousOutputsContext 
      ? `<PREVIOUS_DESIGN_DOCUMENTS>
${previousOutputsContext}</PREVIOUS_DESIGN_DOCUMENTS>`
      : '';
      
    const requestContent =`<TASK_INSTRUCTIONS>
${metaPrompt}
</TASK_INSTRUCTIONS>

${contextBlock}

<USER_DOCUMENT>
${userPRD}
</USER_DOCUMENT>`;
    
    const config: any = {
      systemInstruction: defaultSystemInstruction,
    };

    if (aspectId === AspectId.PLANNING_GOOGLE_SEARCH_RESEARCH) {
      onLog?.('Performing deep research using Google Search...');
      config.tools = [{ googleSearch: {} }];
    }

    onLog?.('Generating output...');

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: requestContent,
      config: config,
    });

    for await (const chunk of stream) {
      onChunk(chunk);
    }
    
  } catch (error) {
    console.error("Error in Gemini service call:", error);
    if (error instanceof Error) {
       // Re-throw a generic, localizable error key. The original message is often too technical.
       throw new Error('error.aiGenerationFailed');
    }
    throw new Error('error.unknownApiError');
  }
};