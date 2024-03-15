import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { IRoom, LoginResponse, TypeUser, Vote } from '../../../../interfaces';

@Injectable({
    providedIn: 'root'
})
export class MyService {
    constructor(private http: HttpClient){}

    getRoom(roomId: string): Observable<HttpResponse<IRoom|any>>{
        return this.http
            .get(environment.apiUrl + '/room/' + roomId, {observe: 'response'})
            .pipe(
                catchError(this.handleError)
            );
    }

    login(roomName: string, username: string, suit: string, userType: TypeUser, roomId: string|null): Observable<LoginResponse>{        
        const obj : any = {
            roomName: roomName,
            username: username,
            type: userType,
            suit: suit
        };
        if(roomId){
            obj.roomId = roomId;
        }
        return this.http.post(environment.apiUrl+'/login',obj) as Observable<LoginResponse>;
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