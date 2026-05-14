import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import ChatMessage, { type Message } from './ChatMessage';
import TypingIndicator from './TypingIndicator';

type FormData = {
   prompt: string;
};

type chatResponse = {
   message: string;
};

const Chatbot = () => {
   // const conversationId = useRef(crypto.randomUUID());
   const [conversationId] = useState(() => crypto.randomUUID());
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState<string>('');
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   async function onSubmit({ prompt }: FormData) {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         reset({ prompt: '' });
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
   function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   }

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessage messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col items-end gap-2 border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
               autoFocus
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default Chatbot;
