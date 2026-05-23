import WebSocket, { WebSocketServer } from "ws";
import { BroadcastParams, ConnectedUser, ServerToClientMessage } from "./types/serverToUserMessage";
import { getRoomUsers } from "./redis";
import { IncomingMessage } from "http";

const wss = new WebSocketServer({ port: 6372 });
const rooms = new Map<string, Set<ConnectedUser>>();
const wsToUser = new Map<WebSocket, ConnectedUser>();

console.log("websocket server is running on - 6372")

const broadcast = ({ roomId, message, exclude }: BroadcastParams){
  const clients = rooms.get(roomId);
  if (!clients) return;

  const data = JSON.stringify(message);
  clients.forEach((connectedUser) => {
    if (connectedUser.ws !== exclude && connectedUser.ws.readyState === WebSocket.OPEN) {
      connectedUser.ws.send(data)
    }
  })
}


const sendToClient = (ws: WebSocket, message: ServerToClientMessage): void => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  }
}


const getActiveUser = async (roomId: string) => {
  const users = await getRoomUsers(roomId);
  return users as { userId: string; name: string;  role : string}[]
}

const authenticateConnection = (
  req:IncomingMessage
) => {

}
