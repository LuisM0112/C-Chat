import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  private socket!: WebSocket;
  private subject: Subject<any> = new Subject<any>();

  constructor() { }

  public connect(userId: string, chatId: string): void {
    this.socket = new WebSocket(`ws://localhost:5000/api/websocket?userId=${userId}&chatId=${chatId}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      this.subject.next(event.data);
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

  public getMessages(): Observable<any> {
    return this.subject.asObservable();
  }

  public disconnect(): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}
