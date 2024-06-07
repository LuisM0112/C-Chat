import { Injectable, WritableSignal, signal } from '@angular/core';
import { Message } from '../model/classes/message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private API_URL: string = 'https://c-chat.runasp.net';
  private TOKEN_ITEM: string = 'C-ChatToken';
  private socket!: WebSocket;
  public message: WritableSignal<Message> = signal(new Message("","","",""));

  constructor() { }

  public connect(chatId: number): void {
    const token = localStorage.getItem(this.TOKEN_ITEM);
    this.socket = new WebSocket(`${this.API_URL}/ws?chatId=${chatId}&jwt=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const messageStr: string[] = event.data.split("¨");
      
      const message: Message = new Message(
        messageStr[0], // <-- author
        messageStr[1], // <-- chat name
        messageStr[2], // <-- date
        messageStr[3]  // <-- content
      );
      this.message.set(message);
    };

    this.socket.onclose = () => {
      this.message.set(new Message("","","",""));
      console.log('WebSocket connection closed');
    };
  }

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  public disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}
