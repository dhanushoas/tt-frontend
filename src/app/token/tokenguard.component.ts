import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "./token.service";

@Injectable({
    providedIn: 'root'
  })
  export class TokenGuard implements CanActivate {
      
    constructor(private tokenService: TokenService, private router: Router) {}
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // Check if the token is verified
      if (this.tokenService.isAuthenticated()) {
        return true; // Allow access to all routes for authenticated users
      } else {
        // Token is not verified, redirect to token verification page
        this.router.navigate(['/token']);
        return false;
      }
    }
  }
  