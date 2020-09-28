import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Iaadhar, STATUS } from '../_models/aadhar';
import { ServiceProxy, ServiceRegistry } from '../_helpers/ServiceProxy';
import { AlertController, ToastController } from '@ionic/angular';
import { IAddFamily } from '../_models/family';
import { AuthService } from '../_services/auth.service';
import { IKYCSTATUS } from '../_models/kyc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addfamily',
  templateUrl: './addfamily.page.html',
  styleUrls: ['./addfamily.page.scss'],
})
export class AddfamilyPage implements OnInit {

  private addFamilyForm: FormGroup;
  userData: any;
  memberExists: boolean;
  memberAadharID: string;
  memberKYCStatus: any;
  currentUser: Iaadhar;
  constructor(private formBuilder: FormBuilder,
    private serviceProxy: ServiceProxy,
    public alertController: AlertController,
    private auth: AuthService,
    public toastController: ToastController,
    private router: Router

  ) { }

  ngOnInit() {
    this.setFamilyForm();
    this.auth.currentUserSubject.subscribe((data) => {
      console.log(data)
      this.currentUser = data;
    });
  }

  async handleButtonClick() {
    const toast = await this.toastController.create({
      color: 'success',
      duration: 2000,
      message: 'Family Member added.',
      // showCloseButton: true
    });
    await toast.present();
  }

  onSubmit() {
    console.log(this.addFamilyForm.value)
    if (this.memberExists) {
      console.log("inside if")
      let addfamily: IAddFamily = {
        aadharID: this.currentUser.id,
        relation: this.addFamilyForm.value.relation,
        memberName: this.addFamilyForm.value.fullName,
        memberAadharID: this.memberAadharID,
        memberMobileNumber: this.addFamilyForm.value.mobileNumber,
        memberKYCStatus: this.memberKYCStatus

      }

      this.serviceProxy.SingleRequest(ServiceRegistry.ADD_FAMILY_MEMBER, addfamily)
        .subscribe(async (arg) => {
          console.log(arg)
          this.handleButtonClick();
          this.router.navigate(['/tabs'])


        });
    }
    else {
      console.log("inside else");
      let addfamily: IAddFamily = {
        aadharID: this.currentUser.id,
        relation: this.addFamilyForm.value.relation,
        memberName: this.addFamilyForm.value.fullName,
        memberAadharID: this.memberAadharID,
        memberMobileNumber: this.addFamilyForm.value.mobileNumber,
        memberKYCStatus: IKYCSTATUS.PENDDING
      }
      this.serviceProxy.SingleRequest(ServiceRegistry.FAMILY_INVITATION, addfamily)
        .subscribe(async (arg) => {
          console.log(arg);
          this.handleButtonClick();
          this.router.navigate(['/tabs'])

        });
    }



  }


  setFamilyForm() {
    this.addFamilyForm = this.formBuilder.group({
      mobileNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      relation: ['', Validators.required]
    });

  }


  onChangeMobile(value) {
    console.log(value)
    const aadhar: Iaadhar = new Iaadhar();
    aadhar.mobileNumber = value;
    this.serviceProxy.SingleRequest(ServiceRegistry.GET_AADHAR_BY_MOBILE, aadhar)
      .subscribe(async (arg) => {
        console.log(arg.result)
        if (arg.result != null && arg.status == STATUS.OK) {
          this.memberExists = true;
          this.memberAadharID = arg.result[0].id;
          this.memberKYCStatus = arg.result[0].kycStatus;
          this.userData = arg.result[0];
          this.presentAlert(this.userData)
        }
        else {
          this.memberAadharID = '',
            this.memberExists = false;
        }
      })
  }

  async presentAlert(filename) {
    const alert = await this.alertController.create({
      header: 'User already exists.',
      // subHeader: filename,
      message: this.userData.fullName + ' already exists.Add with your Relation',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.addFamilyForm.controls['fullName'].setValue(this.userData.fullName);
          }
        }
      ]
    });

    await alert.present();
  }
}
