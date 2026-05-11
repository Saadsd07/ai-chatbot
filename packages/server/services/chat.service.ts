import { GoogleGenAI } from '@google/genai';
import { conversationRepository } from '../repositories/conversation.repositories';

const client = new GoogleGenAI({
   apiKey: process.env.GOOGLE_API_KEY,
});

type ChatResponse = {
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      // 1. Store user message
      conversationRepository.addMessage(conversationId, {
         role: 'user',
         text: prompt,
      });

      // 2. Get recent history
      const trimmed = conversationRepository.getTrimmedHistory(
         conversationId,
         12
      );

      // 3. Send to Gemini
      const response = await client.models.generateContent({
         model: 'gemini-2.5-flash-lite',

         contents: trimmed.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
         })),

         config: {
            temperature: 0.3,
            maxOutputTokens: 180,
         },
      });

      // 4. Extract AI text
      const aiText = response.text ?? '';

      // 5. Save AI response
      conversationRepository.addMessage(conversationId, {
         role: 'model',
         text: aiText,
      });

      // 6. Trim memory
      conversationRepository.trimAndSave(conversationId, 20);

      // 7. Return response
      return {
         message: aiText,
      };
   },
};
