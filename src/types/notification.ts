export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface WebSocketMessage {
  title?: string;
  message: string;
}