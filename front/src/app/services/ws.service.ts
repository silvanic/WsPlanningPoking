import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IRoom } from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;

  message: Subject<IRoom>= new Subject<IRoom>();
  connected: Subject<boolean>= new Subject<boolean>();

  constructor() { }

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.connected.next(true);
    };

    this.socket.onmessage = (event) => {
      console.log(event.data.toString());
      this.message.next(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.connected.next(false);
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