export interface IGetConversations {
  id: string;
  conversationId: string;
  countMessages: number;
  profile: { id: string; name: string };
}
