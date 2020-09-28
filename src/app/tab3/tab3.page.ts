import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenHelper } from '../_helpers/TokenHelper';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  currentUser:any
  constructor(private router:Router) {
    this.currentUser = JSON.parse(TokenHelper.GetUserDetails())
    console.log(this.currentUser.kycStatus)
  }
  logout(){
    TokenHelper.RemoveLoginToken();
    TokenHelper.RemoveUserDetails();
    this.router.navigate(['/login'])
    
  }
  myFamily(){
    this.router.navigate(['/family'])
  }
}
