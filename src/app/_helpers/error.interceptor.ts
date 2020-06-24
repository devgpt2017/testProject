import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private userservice: UsersService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // if 401 response returned from api
                
            }
            let errorJson = err.error;
            if(errorJson)
            {
                const error = errorJson.message;
                return throwError(error);
            }
            else
            {
                const error = err.message || err.statusText;
                return throwError(error);
            }
            
        }));
    }
}
