import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Iaadhar, IResponse, STATUS } from "../_models/aadhar";
import { ServiceProxy, ServiceRegistry } from "../_helpers/ServiceProxy";
import { TokenHelper } from "../_helpers/TokenHelper";
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  mobileForm: FormGroup;
  otpForm: FormGroup;
  enableOTP: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private serviceproxy: ServiceProxy,
    private router:Router,
    private auth:AuthService
  ) {
    this.mobileForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.minLength(10), Validators.required]],
    });
    this.otpForm = this.formBuilder.group({
      otp: ["", [Validators.minLength(6), Validators.required]],
    });
  }

  ngOnInit() {}
  async GetOTP() {
    
    if (this.mobileForm.invalid) {
      alert("please enter valid mobile number");
    } else {
      const aadhar: Iaadhar = new Iaadhar();
      aadhar.mobileNumber = this.mobileForm.value.mobileNumber;
      this.serviceproxy
        .SingleRequest(ServiceRegistry.MOBILE_LOGIN, aadhar)
        .subscribe(async (arg) => {
          console.log(arg);
          const r: IResponse = arg;
          TokenHelper.SaveLoginToken(r.token);
          if (r.status === STATUS.OK) {
            alert(r.result)
            this.enableOTP = true;
            this.mobileForm.disable();
          } else {
            alert("Something Failed please try after some time")
          }
        });
    }
  }

  validateOTP(){
    if(this.otpForm.invalid){
      alert("please enter valid otp")
    }
    else{

        let otp=this.otpForm.value
      
      this.serviceproxy.SingleRequest(ServiceRegistry.VALIDATE_OTP,otp).subscribe(async(arg)=>{
        console.log(arg);
        const r: IResponse = arg;
        if (arg.status === STATUS.OK) {
          TokenHelper.SaveLoginToken(arg.token);
          TokenHelper.SaveUserDetails(arg.result);
          this.auth.storeData(arg.result)
          if(arg.result.profileCompletion==false){
            this.router.navigate(['/home'])
          }
          else{
            this.router.navigate(['/tabs'])
          }
         
        }
        else{
          alert("Invalid OTP or Authentication Failed")
        }
      })
    }
  }
}
