import { Injectable } from '@angular/core';
import { Iaadhar } from '../_models/aadhar';
import { Observable, BehaviorSubject } from 'rxjs';
import { TokenHelper } from '../_helpers/TokenHelper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: Observable<Iaadhar>;
  public currentUserSubject: BehaviorSubject<Iaadhar>;
  constructor(private router:Router) {
    this.currentUserSubject = new BehaviorSubject<Iaadhar>(JSON.parse(TokenHelper.GetUserDetails()));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): Iaadhar {
    return this.currentUserSubject.value;
  }

  storeData(result) {
    console.log(result);
    this.currentUserSubject.next(result);
  
  }
  logout(){

    TokenHelper.RemoveLoginToken();
    TokenHelper.RemoveUserDetails();
    this.router.navigate(['/login'])
    
  }
}
