import { Server } from 'socket.io';

export interface IServer extends Server {
  profiles: Map<string, string>; //profileId, socketId
}
