import { Component, OnInit } from '@angular/core';
import { ServiceRegistry, ServiceProxy } from '../_helpers/ServiceProxy';
import { AuthService } from '../_services/auth.service';
import { IAddFamily } from '../_models/family';
import { Iaadhar } from '../_models/aadhar';

@Component({
  selector: 'app-family',
  templateUrl: './family.page.html',
  styleUrls: ['./family.page.scss'],
})
export class FamilyPage implements OnInit {
  currentUser: Iaadhar;
  familyMembers: any;
  enable: boolean;

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
      console.log(this.familyMembers.length)
      this.enable=true
    })
  }

}
