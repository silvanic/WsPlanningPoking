import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SseService {
  
  /**
   * Create event source
   * @paramurl
   */

  getEventSource(url: string): EventSource{
    return new EventSource(url);
  }
}