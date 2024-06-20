export interface IRetrieveMessages {
  historyId: string;
  messages: {
    id: string;
    content: string;
    fromId: string;
    createdAt: Date;
  }[];
}