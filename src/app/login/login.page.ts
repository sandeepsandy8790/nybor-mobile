import { Component, OnInit, Injector } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Iaadhar, IResponse, STATUS } from "../_models/aadhar";
import { ServiceRegistry } from "../_helpers/ServiceProxy";
import { TokenHelper } from "../_helpers/TokenHelper";
import { AuthService } from '../_services/auth.service';
import { GenericPage } from '../_helpers/GenericPage';
import { LoadingspinnerService } from '../_services/loadingspinner.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage extends GenericPage implements OnInit {
  mobileForm: FormGroup;
  constructor(
    public injector: Injector,
    private formBuilder: FormBuilder,
    private spinner:LoadingspinnerService
  ) {
    super(injector);
    this.mobileForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.minLength(10), Validators.required]],
    });
 
  }

  ngOnInit() {}
  async GetOTP() {
    
    if (this.mobileForm.invalid) {
      this.presentToast('Please enter valid Mobile Number',2000,'danger')
    } else {
   //  await this.spinner.present()
      const aadhar: Iaadhar = new Iaadhar();
      aadhar.mobileNumber = this.mobileForm.value.mobileNumber;
      this.serviceProxy
        .SingleRequest(ServiceRegistry.MOBILE_LOGIN, aadhar)
        .subscribe(async (arg) => {
    //    await  this.spinner.dismiss()
          console.log(arg);
          const r: IResponse = arg;
          TokenHelper.SaveLoginToken(r.token);
          if (r.status === STATUS.OK) {
           
            
            this.router.navigate(['/otp'])
          } else {
            this.presentToast('Failed to Login',2000,'danger')
       
          }
        });
    }
  }

  // validateOTP(){
  //   if(this.otpForm.invalid){
  //     alert("please enter valid otp")
  //   }
  //   else{

  //       let otp=this.otpForm.value
      
  //     this.serviceproxy.SingleRequest(ServiceRegistry.VALIDATE_OTP,otp).subscribe(async(arg)=>{
  //       console.log(arg);
  //       const r: IResponse = arg;
  //       if (arg.status === STATUS.OK) {
  //         TokenHelper.SaveLoginToken(arg.token);
  //         TokenHelper.SaveUserDetails(arg.result);
  //         this.auth.storeData(arg.result)
  //         if(arg.result.profileCompletion==false){
  //           this.router.navigate(['/home'])
  //         }
  //         else{
  //           this.router.navigate(['/tabs'])
  //         }
         
  //       }
  //       else{
  //         alert("Invalid OTP or Authentication Failed")
  //       }
  //     })
  //   }
  // }
}
