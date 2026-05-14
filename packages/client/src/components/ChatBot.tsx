import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
   prompt: string;
};

type chatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'model';
};

const Chatbot = () => {
   // const conversationId = useRef(crypto.randomUUID());
   const [conversationId] = useState(() => crypto.randomUUID());
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const formRef = useRef<HTMLFormElement | null>(null);
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   async function onSubmit({ prompt }: FormData) {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      reset();
      setIsBotTyping(true);
      const { data } = await axios.post<chatResponse>('/api/chat', {
         prompt: prompt,
         conversationId: conversationId,
      });
      setMessages((prev) => [
         ...prev,
         { content: data.message, role: 'model' },
      ]);
      setIsBotTyping(false);
   }
   function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   }

   const onCopyMessage = (
      e: React.ClipboardEvent<HTMLParagraphElement>
   ): void => {
      const selection = window.getSelection()?.toString()?.trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  onCopy={onCopyMessage}
                  className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 bg-gray-200 rounded-xl px-3 py-3">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]" />
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            ref={formRef}
            className="flex flex-col items-end gap-2 border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
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
