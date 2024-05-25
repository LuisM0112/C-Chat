import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '../model/classes/message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private API_URL: string = 'https://localhost:7201';
  private TOKEN_ITEM: string = 'C-ChatToken';
  private socket!: WebSocket;
  private subject: Subject<any> = new Subject<any>();

  constructor() { }

  public connect(chatId: number): void {
    const token = localStorage.getItem(this.TOKEN_ITEM);
    this.socket = new WebSocket(`${this.API_URL}/ws?chatId=${chatId}&jwt=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const messageStr: string[] = event.data.split("¨")
      
      const message: Message = new Message(
        messageStr[0],
        messageStr[1],
        messageStr[2],
        messageStr[3]
      );
      this.subject.next(message);
      console.log(message);
      
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  public getMessages(): Observable<Message> {
    return this.subject.asObservable();
  }

  public disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}
