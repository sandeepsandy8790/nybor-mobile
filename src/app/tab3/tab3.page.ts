import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenHelper } from '../_helpers/TokenHelper';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private router:Router) {}
  logout(){
    TokenHelper.RemoveLoginToken();
    TokenHelper.RemoveUserDetails();
    this.router.navigate(['/login'])
    
  }

}
