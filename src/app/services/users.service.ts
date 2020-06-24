import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Users } from '../models/users';


@Injectable({ providedIn: 'root' })
export class UsersService {
    constructor(private http: HttpClient) { }

    getAllUsers(page: number): Observable<Users> {
        
        return this.http.get<Users>(`${environment.apiUrlLocal}/api/users?page=`+page);
    }


    /*getInquiryDetails(inquiry_id: number): Observable<Users> {
        return this.http.post<Users>(`${environment.apiUrlLocal}/staff-inquiry/inquiry-details`,{inquiry_id: inquiry_id});
    }*/

    /*getById(id: number): Observable<TodayFollowup> {
        return this.http.get<TodayFollowup>(`${environment.apiUrlLocal}/message/user-view?id=${id}`);
    }*/
}