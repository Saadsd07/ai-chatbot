import axios from 'axios';
import { useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import ChatMessage, { type Message } from './ChatMessage';
import TypingIndicator from './TypingIndicator';

type chatResponse = {
   message: string;
};

const Chatbot = () => {
   // const conversationId = useRef(crypto.randomUUID());
   const [conversationId] = useState(() => crypto.randomUUID());
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState<string>('');

   async function onSubmit({ prompt }: ChatFormData) {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         const { data } = await axios.post<chatResponse>('/api/chat', {
            prompt: prompt,
            conversationId: conversationId,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'model' },
         ]);
      } catch (e) {
         console.log(e);
         setError('Something went wrong. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   }

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessage messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default Chatbot;
