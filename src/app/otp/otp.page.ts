import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceProxy, ServiceRegistry } from '../_helpers/ServiceProxy';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { IResponse, STATUS, IOTP } from '../_models/aadhar';
import { TokenHelper } from '../_helpers/TokenHelper';
import { GenericPage } from '../_helpers/GenericPage';
import { LoadingspinnerService } from '../_services/loadingspinner.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage extends GenericPage implements OnInit {
  @ViewChild('input') myInput;
  otpForm: FormGroup;
  type: any;
  value: any;
  constructor(
    public injector: Injector,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private spinner: LoadingspinnerService,
    private route: ActivatedRoute
  ) {
    super(injector)
    this.type = this.route.snapshot.queryParamMap.get('type')
    this.value = this.route.snapshot.queryParamMap.get('value')

    this.otpForm = this.formBuilder.group({
      otp1: ["", [Validators.minLength(1), Validators.required]],
      otp2: ["", [Validators.minLength(1), Validators.required]],
      otp3: ["", [Validators.minLength(1), Validators.required]],
      otp4: ["", [Validators.minLength(1), Validators.required]],
      otp5: ["", [Validators.minLength(1), Validators.required]],
      otp6: ["", [Validators.minLength(1), Validators.required]],
    });
  }

  ngOnInit() {
  }
  moveFocus(nextElement) {
    nextElement.focus();
  }

  async validateOTP() {
    
    if (this.otpForm.invalid) {
      this.presentToast('Please enter valid OTP', 2000, 'warning')
    }
    else {
      //  await this.spinner.present();
      let onetimepassword = this.otpForm.value.otp1 + this.otpForm.value.otp2 + this.otpForm.value.otp3 + this.otpForm.value.otp4 + this.otpForm.value.otp5 + this.otpForm.value.otp6;

      const otp: IOTP = new IOTP();
      otp.otp = onetimepassword;
      if (this.type == 'changeMobileNumber') {
        let data = {
          otp: onetimepassword,
          mobileNumber: this.value
        }
        this.serviceProxy.SingleRequest(ServiceRegistry.VALIDATE_OTP_CHANGEMOBILENUMBER, data).subscribe(async (arg) => {
          // await  this.spinner.dismiss()
          console.log(arg);
          const r: IResponse = arg;
          if (arg.status === STATUS.OK) {
            this.presentToast('Mobile Number changed Successfully', 2000, 'success')
            this.otpForm.reset()
            TokenHelper.SaveLoginToken(arg.token);
            TokenHelper.SaveUserDetails(arg.result);
            this.auth.storeData(arg.result)
            this.router.navigate(['/tabs'])
          }
          else {
            this.presentToast('Invalid OTP or No Token Provided', 2000, 'danger')
          }
        })
      }
      else {
        this.serviceProxy.SingleRequest(ServiceRegistry.VALIDATE_OTP, otp).subscribe(async (arg) => {
          // await  this.spinner.dismiss()
          console.log(arg);
          const r: IResponse = arg;
          if (arg.status === STATUS.OK) {
            this.otpForm.reset()
            TokenHelper.SaveLoginToken(arg.token);
            TokenHelper.SaveUserDetails(arg.result);
            this.auth.storeData(arg.result)
            if (arg.result.profileCompletion == false) {
              this.router.navigate(['/profile'])
            }
            else {
              this.router.navigate(['/tabs'])
            }

          }
          else {
            this.presentToast('Invalid OTP or No Token Provided', 2000, 'danger')
          }
        })
      }

    }
  }
}
