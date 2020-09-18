import { Component, OnInit } from '@angular/core';
import { ServiceRegistry, ServiceProxy } from '../_helpers/ServiceProxy';
import { AuthService } from '../_services/auth.service';
import { IAddFamily } from '../_models/family';

@Component({
  selector: 'app-family',
  templateUrl: './family.page.html',
  styleUrls: ['./family.page.scss'],
})
export class FamilyPage implements OnInit {
  currentUser: import("c:/Users/vijay/Desktop/nybor-mobile/src/app/_models/aadhar").Iaadhar;
  familyMembers: any;

  constructor(private serviceProxy: ServiceProxy,
    private auth: AuthService) { }

  ngOnInit() {
    this.getFamily();
  }

  getFamily() {
    this.auth.currentUserSubject.subscribe((data) => {
      this.currentUser = data;
    })
    let family:IAddFamily = {
      aadharID : this.currentUser.id

    }
    let Members = this.serviceProxy.SingleRequest(ServiceRegistry.GET_FAMILY_BY_ID, family).subscribe(data => {
      console.log(data.result)
      this.familyMembers = data.result
    })
  }

}
