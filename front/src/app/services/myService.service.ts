import { Injectable, NgZone } from "@angular/core";
import { SseService } from "./sse.service";
import { Observable, catchError, throwError } from "rxjs";
import { MessageSSE } from "../types";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MyService {
    constructor(private _zone: NgZone, private _sseService: SseService, private http: HttpClient){}

    getServerSentEvent(url: string) : Observable<MessageSSE>{
        return new Observable( observer=> {
            const eventSource = this._sseService.getEventSource(url);
            eventSource.onmessage = event => {
                this._zone.run(() => {
                    observer.next(event);
                })
            }

            eventSource.onerror = event => {
                this._zone.run(() => {
                    observer.error(event);
                })
            }
        })
    }

    getRoom(roomId: string): Observable<HttpResponse<any>>{
        return this.http
            .get(environment.apiUrl + '/room/' + roomId, {observe: 'response'})
            .pipe(
                catchError(this.handleError)
            );
    }

    voter(roomId: string, userId: string, vote: string): Observable<any>{
        return this.http
            .put(environment.apiUrl+'/room/'+roomId+'/voter',{
                userId: userId,
                vote: vote
            });
    }

    passer(roomId: string){
        return this.http.put(environment.apiUrl+'/room/'+roomId, null);
    }
    
    update(roomId: string, body: Object){
        return this.http.put(environment.apiUrl+'/room/'+roomId, body);
    }

    login(roomName: string, username: string, suit: string, roomId: string|null){        
        const obj : any = {
            roomName: roomName,
            username: username,
            suit: suit
        };
        if(roomId){
            obj.roomId = roomId;
        }
        return this.http.post(environment.apiUrl+'/login',obj);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }
}