export type Message = {
   role: 'user' | 'model';
   text: string;
};

const conversations = new Map<string, Message[]>();

export const conversationRepository = {
   getConversation(conversationId: string): Message[] {
      if (!conversations.has(conversationId)) {
         conversations.set(conversationId, []);
      }

      return conversations.get(conversationId)!;
   },

   addMessage(conversationId: string, message: Message) {
      const history = this.getConversation(conversationId);

      history.push(message);

      conversations.set(conversationId, history);
   },

   getTrimmedHistory(conversationId: string, limit = 12): Message[] {
      const history = this.getConversation(conversationId);

      return history.slice(-limit);
   },

   trimAndSave(conversationId: string, limit = 20) {
      const history = this.getConversation(conversationId);

      conversations.set(conversationId, history.slice(-limit));
   },
};
