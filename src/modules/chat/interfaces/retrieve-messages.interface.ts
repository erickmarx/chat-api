export interface IRetrieveMessages {
  historyId: string;
  message: {
    id: string;
    content: string;
    fromId: string;
    createdAt: Date;
  };
}
