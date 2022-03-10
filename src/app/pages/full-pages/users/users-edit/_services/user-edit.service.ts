import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { IContact, ICorporativo, IData, IDetailCorporate, ISucess, ITwContactCoporate } from '../_models/user-edit';



@Injectable({
    providedIn: 'root'
})
export class UserEditService {

    apiURL = '/api/public'; //environment.apiURL;
    auth_token = 'Bearer ' + localStorage.getItem('tokenscloud');

    constructor(private http: HttpClient) { }

    headers: HttpHeaders = new HttpHeaders({
        "Authorization": this.auth_token
    });

    /**
     * Get user from api
     * @param: ID
     */
    getDetailUser(ID:number): Observable<{ error: boolean, msg: string, data:ICorporativo }> {
        return this.http
            .get<{ error: boolean, msg: string, data:ISucess }>(
                `${this.apiURL}/corporativos/${ID}`,
                { headers: this.headers }
            )
            .pipe(
                map(r => {
                    return {
                        error: r.error,
                        msg: r.msg,
                        data: r.data.corporativo
                    }
                }),
                catchError(this.error)
            );
    }

    /**
     * Update user from api
     * @param: detail
     */
    putDetailCorporate(detail:IDetailCorporate): Observable<IData> {
        return this.http
          .put<{data:IData}>(
            `${this.apiURL}/corporativos/${detail.id}`,
            detail,
            { headers: this.headers }
          )
          .pipe(map(success => success.data));
    }

    /**
     * Create new contact from api
     * @param: contact
     */
    postContact(contact:IContact): Observable<ITwContactCoporate> {
        return this.http
          .post<{data:ITwContactCoporate}>(
            `${this.apiURL}/contactos`,
            contact,
            { headers: this.headers }
          )
          .pipe(map(success => success.data));
    }

    /**
     * Update contact from api
     * @param: contact
     */
    putContact(contact:IContact): Observable<ITwContactCoporate> {
        return this.http
          .put<{data:ITwContactCoporate}>(
            `${this.apiURL}/contactos/${contact.id}`,
            contact,
            { headers: this.headers }
          )
          .pipe(map(success => success.data));
    }

    /**
     * Delete contact from api
     * @param: ID
     */
    deleteContact(ID:number): Observable<any> {
        return this.http
          .delete<any>(
            `${this.apiURL}/contactos/${ID}`,
            { headers: this.headers }
          )
          .pipe(map(success => success));
    }

    /**
     * Handle error
     */
    error(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error code: ${error.status} Message:_${error.message}`;
        }
        return of({ error: true, msg: errorMessage, data: null });
    }

}
