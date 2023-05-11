import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate{
    constructor(private authService:AuthService, private router: Router){}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):boolean | Observable<boolean> | Promise<boolean>{
            const isAuth = this.authService.getAuth();
            if(!isAuth){
                this.router.navigate(['/']);
            }
            return isAuth;
        }
}