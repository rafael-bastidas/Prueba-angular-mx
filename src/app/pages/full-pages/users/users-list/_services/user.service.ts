import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

import { Observable, of } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { IData } from '../_models/user-list';



@Injectable({
    providedIn: 'root'
})
export class UsersService {

    apiURL = '/api/public/corporativos'; //environment.apiURL;
    auth_token = 'Bearer ' + localStorage.getItem('tokenscloud');

    constructor(private http: HttpClient) { }

    headers: HttpHeaders = new HttpHeaders({
        "Authorization": this.auth_token
    });

    /**
     * Get all users from api
     */
    getUsers(): Observable<{ error: boolean, msg: string, data: { id:number, S_LogoURL: string, S_NombreCorto: string, S_NombreCompleto: string, S_SystemUrl: string, D_FechaIncorporacion: Date, created_at: Date, user_created: string, asignado: string, S_Activo: string }[] }> {
        return this.http
            .get<{ error: boolean, msg: string, data: IData[] }>(
                this.apiURL,
                { headers: this.headers }
            )
            .pipe(
                map(r => {
                    return {
                        error: r.error,
                        msg: r.msg,
                        data: r.data.map(item => {
                            return {
                                id: item.id,
                                S_LogoURL: typeof item.S_LogoURL !== 'string' ? 'https://icons.veryicon.com/png/o/system/ued_v10-of-shengye-group/general-user-name-icon.png' : item.S_LogoURL,
                                S_NombreCorto: item.S_NombreCorto,
                                S_NombreCompleto: item.S_NombreCompleto,
                                S_SystemUrl: 'devschoolcloud.com/sa/#/' + item.S_SystemUrl,
                                D_FechaIncorporacion: new Date(item.D_FechaIncorporacion),
                                created_at: new Date(item.created_at),
                                user_created: item.user_created.S_Nombre,
                                asignado: item.asignado.S_Nombre,
                                S_Activo: item.S_Activo == 1 ? 'Activo' : 'Inactivo'
                            }
                        })
                    }
                }),
                catchError(this.error)
            );
    }

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
