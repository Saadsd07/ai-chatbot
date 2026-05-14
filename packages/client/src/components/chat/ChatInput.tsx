import React from 'react';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const Submit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         Submit();
      }
   }

   return (
      <form
         onSubmit={Submit}
         onKeyDown={handleKeyDown}
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
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
