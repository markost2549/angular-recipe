import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject } from "rxjs";
import { User } from "./user.model";


export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({ providedIn: "root" })
export class AuthService {

    user = new Subject<User>();

    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBbfrfAvGKg-LuzEiOFQsdnHgKCpSIuZTY',
            {
                email: email,
                password: password,
                returnSecureToken: true,
            })
            .pipe(catchError(this.handleError), tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn,
                )
            }))
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBbfrfAvGKg-LuzEiOFQsdnHgKCpSIuZTY',
            {
                email: email,
                password: password,
                returnSecureToken: true,
            })
            .pipe(catchError(this.handleError), tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn,
                )
            }))
    }


    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn);
        const user = new User(email, userId, token, expirationDate);
        this.user.next();
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown message occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account';
                break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errorMessage = 'Invaid username or password';
                break;
            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator.'
                break;
        }

        return throwError(errorMessage);
    }

}