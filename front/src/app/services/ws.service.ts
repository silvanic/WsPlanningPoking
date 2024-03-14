import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;

  message: Subject<any>= new Subject<any>();

  constructor() { }

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      console.log(event.data.toString());
      this.message.next(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: any): void {
    this.socket.send(JSON.stringify(message));
  }

  closeConnection(): void {
    this.socket.close();
  }
}