import { Component, OnInit, Injector } from '@angular/core';
import { GenericPage } from '../_helpers/GenericPage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingspinnerService } from '../_services/loadingspinner.service';
import { Iaadhar, IResponse, STATUS } from '../_models/aadhar';
import { ServiceRegistry } from '../_helpers/ServiceProxy';
import { TokenHelper } from '../_helpers/TokenHelper';

@Component({
  selector: 'app-mobilenumberchange',
  templateUrl: './mobilenumberchange.page.html',
  styleUrls: ['./mobilenumberchange.page.scss'],
})
export class MobilenumberchangePage extends GenericPage implements OnInit {

  changeMobileForm: FormGroup;
  constructor(
    public injector: Injector,
    private formBuilder: FormBuilder,
    private spinner:LoadingspinnerService
  ) {
    super(injector);
    this.changeMobileForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.minLength(10), Validators.required]],
    });
 
  }
  ngOnInit(){}
  async GetOTP() {
    
    if (this.changeMobileForm.invalid) {
      this.presentToast('Please enter valid Mobile Number',2000,'danger')
    } else {
   //  await this.spinner.present()
      const aadhar: Iaadhar = new Iaadhar();
      aadhar.mobileNumber = this.changeMobileForm.value.mobileNumber;
      this.serviceProxy
        .SingleRequest(ServiceRegistry.CHANGE_MOBILE_NUMBER, aadhar)
        .subscribe(async (arg) => {
      //  await  this.spinner.dismiss()
          console.log(arg);
          const r: IResponse = arg;
         
          if (r.status === STATUS.IOERROR && r.result===null) {
           
            this.presentToast('Mobile Number already Exist Please try to Login',2000,'danger')
          } else {
            TokenHelper.SaveLoginToken(r.token);
            this.router.navigate(['/otp/changeMobileNumber'],{queryParams:{type:'changeMobileNumber',value:this.changeMobileForm.value.mobileNumber}})
          }
        });
    }
  }
}
