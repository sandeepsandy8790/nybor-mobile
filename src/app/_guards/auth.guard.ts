import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { TokenHelper } from '../_helpers/TokenHelper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

        let url = route.pathFromRoot
            .map(v => v.url.map(segment => segment.toString()).join('/'))
            .join('/');

        return this.auth.currentUser.pipe(map(arg => {
            const t = TokenHelper.GetLoginToken();
            if (arg) {
                if (t) {
                  
               
                    return true
                }
                else {
                    // this.storage.set('url', url);
                    this.router.navigate(['/login']);
                    return false;
                }

            }
            else {
                // this.storage.set('url', url);
                this.router.navigate(['/login']);
                return false;
            }
        }))

    }
  
}
