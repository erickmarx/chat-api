export interface IGetHistory {
  profile: {
    name: string;
    lastSeenAt: Date | null;
  };
  historyId: string;
  messages: {
    id: string;
    createdAt: Date;
    content: string;
    fromId: string;
  }[];
}
