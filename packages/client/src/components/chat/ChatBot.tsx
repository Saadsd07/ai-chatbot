import axios from 'axios';
import { useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import ChatMessage, { type Message } from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

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
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setError('');
         popAudio.play();
         setIsBotTyping(true);

         const { data } = await axios.post<chatResponse>('/api/chat', {
            prompt: prompt,
            conversationId: conversationId,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'model' },
         ]);
         notificationAudio.play();
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
