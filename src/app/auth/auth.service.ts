import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Auth } from "./auth.model";
import { environment } from "src/environments/environment.prod";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({providedIn: 'root'})

export class AuthService {
    private isAthenticated =false;
    private token: string |any;
    private tokenTimer: any;
    private userId: string | any;
    private authStatusListner = new Subject<boolean>()

    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getAuth() {
        return this.isAthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListner() {
        return this.authStatusListner.asObservable();
    }

    createUser(email: string, password: string) {
        const auth: Auth = {email: email, password: password}
        this.http.post(BACKEND_URL + '/signup',auth).subscribe((res)=>{
            this.router.navigate(['/'])
        }, (error)=>{
            this.authStatusListner.next(false);
        });
    }

    login(email: string, password: string) {
        const auth: Auth = {email: email, password: password}
        this.http.post<{token: string,expiresIn: number,userId: string}>
        (BACKEND_URL + '/login',auth).subscribe(res=> {
            console.log(res);
            const token = res.token
            this.token = token;
            if(token){
             const expiedDuration = res.expiresIn; 
             this.setAuthTimer(expiedDuration);
            this.isAthenticated = true;
            this.userId = res.userId;
            this.authStatusListner.next(true);
            const now = new Date();
            const expiratioDate = new Date(now.getTime() + expiedDuration*1000);
            console.log('expiratioDate',expiratioDate);
            this.saveAuthData(token,expiratioDate, this.userId);
            this.router.navigate(['/list']);
            }
        }, error=> {
            this.authStatusListner.next(false);
        })
    }

    autoAuthUser() {
        const authInfo:any = this.getAuthData();
        if(!authInfo) {
            return;
        }
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0) {
            this.token = authInfo.token;
            this.isAthenticated = true;
            this.userId = authInfo.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListner.next(true);
        }
    }

    logOut() {
        this.token = null;
        this.isAthenticated = false;
        this.authStatusListner.next(false);
        clearTimeout(this.tokenTimer);
        this.userId = null;
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration:number) {
        console.log('Setting time:' + duration);
        this.tokenTimer = setTimeout(()=> {
            this.logOut()
         },duration*1000); 
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }
    
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expirationDate');
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

}