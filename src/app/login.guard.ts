import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PasswordsService } from './passwords.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private passwords: PasswordsService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.passwords.isDecrypted) {
      return true;
    }

    if(this.passwords.hasDB) {
      this.router.navigate(['/login']);
    }else {
      this.router.navigate(['/create']);
    }

    return false;
  }
}
