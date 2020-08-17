import { Component, OnInit, Injector } from '@angular/core';
import { GenericPage } from '../_helpers/GenericPage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { IGender, Iaadhar, STATUS } from '../_models/aadhar';
import { ServiceRegistry } from '../_helpers/ServiceProxy';
import { TokenHelper } from '../_helpers/TokenHelper';
import { LoadingspinnerService } from '../_services/loadingspinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends GenericPage implements OnInit {
  url = this.serviceProxy.BASE_URL + '/';
  userProfileForm: FormGroup;
  userProfile: Iaadhar;
  gender: IGender[];
  selectedGender: IGender;

  selectedFile: any;
  tempID: any;
  getName: any;
  previewUrl: string | ArrayBuffer;
  dob: any;
  date: Array<number> = new Array();
  year: Array<number> = new Array();


  dateSheetOptions: any = {
    subHeader: "Select Date",
  };
  monthSheetOptions: any = {
    subHeader: "Select Month",
  };
  yearSheetOptions: any = {
    subHeader: "Select Year",
  };
  isDate: boolean = false;

  isLoggedIn = false;
  users = { id: "", name: "", email: "", picture: { data: { url: "" } } };
  profileImage: any;
  constructor(
    public injector:Injector,
    private fb: Facebook,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private spinner:LoadingspinnerService
  
  ) {
    super(injector)
    // fb.getLoginStatus()
    //   .then((res) => {
    //     console.log(res.status);
    //     if (res.status === "connect") {
    //       this.isLoggedIn = true;
    //     } else {
    //       this.isLoggedIn = false;
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }
  setupForm() {
    this.userProfileForm = this.formBuilder.group({
      fullName: ["", [Validators.required]],
      date: ["", [Validators.required]],
      month: ["", [Validators.required]],
      year: ["", [Validators.required]],
      gender: [""],
      image: [""]
    });
  }
  ngOnInit() {
    this.auth.currentUserSubject.subscribe((data) => {
      this.userProfile = data;
    });
    this.profileImage = this.userProfile.image;
    this.setupForm();
    this.dateOfBirth();
    this.gender = [
      { id: 1, gender: "female", selected: false },
      { id: 2, gender: "male", selected: false },
      { id: 3, gender: "other", selected: false },
    ];
    this.getProfileDetails();
  }

  dateOfBirth() {
    var dt = new Date();
    let i = 1;
    while (i <= 31) {
      this.date.push(i);
      i++;
    }
    let j = 1950;
    while (j <= dt.getFullYear()) {
      this.year.push(j);
      j++;
    }
    console.log(this.date, "mouni's");
    console.log(this.year);
  }
  selectGender(item: IGender) {

    this.selectedGender = new IGender();
    this.selectedGender = item;
    for (const key of this.gender) {
      if (key.selected === true) {
        key.selected = false;
      }
    }
    this.gender[item.id - 1].selected = true;
  }
  // fbLogin() {
  //   this.fb
  //     .login(["public_profile", "user_friends", "email"])
  //     .then((res) => {
  //       if (res.status === "connected") {
  //         this.isLoggedIn = true;
  //         this.getUserDetail(res.authResponse.userID);
  //       } else {
  //         this.isLoggedIn = false;
  //       }
  //     })
  //     .catch((e) => console.log("Error logging into Facebook", e));
  // }
  // getUserDetail(userid: any) {
  //   this.fb
  //     .api("/" + userid + "/?fields=id,email,name,picture", ["public_profile"])
  //     .then((res) => {
  //       console.log(res);
  //       this.users = res;
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }

  // logout() {
  //   this.fb
  //     .logout()
  //     .then((res) => (this.isLoggedIn = false))
  //     .catch((e) => console.log("Error logout from Facebook", e));
  // }

  getProfileDetails() {

    this.dob = this.userProfile.dateofBirth;
    let response = this.dob.split("-");
    let responsedate = response[0];
    let responsemonth = response[1];
    let responseyear = response[2];
    this.userProfileForm.patchValue({
      fullName: this.userProfile.fullName || '',
      gender: this.userProfile.gender || '',
      date: responsedate || '',
      month: responsemonth || '',
      year: responseyear || ''
    })
    if (this.userProfile.gender.selected) {
      let id = this.userProfile.gender.id;
      for (let i = 0; i < this.gender.length; i++) {
        if (this.gender[i].id == id) {
          this.gender[i].selected = true
        }
      }
    }
  }
 async onSubmit() {



    if (this.userProfileForm.invalid) {
     this.presentToast('Please Fill all Details',3000,'warning')
    }
    else {
     // this.spinner.present();
      let userProfile: Iaadhar = new Iaadhar();
      userProfile = this.userProfileForm.value;
      userProfile.gender = this.selectedGender
      if (!this.selectedFile) {
        userProfile.image = this.userProfile.image;
      }
      let profile = {
        personalProfile: userProfile
      }
      console.log(userProfile);
      this.serviceProxy.SingleRequest(ServiceRegistry.UPDATE_PROFILE, profile)
        .subscribe( arg => {
          if (!this.selectedFile) {
         //   this.spinner.dismiss()
          }
          const r = arg;

          if (r.status === STATUS.OK) {
            TokenHelper.SaveUserDetails(arg.result);
            this.auth.currentUserSubject.next(arg.result);
            this.tempID = arg.result.id;

            if (this.selectedFile) {
              const profileData = new FormData();
              let selectedfilename = this.selectedFile.name;
              let filename = selectedfilename.replace(/ +/g, "")
              profileData.append('image', this.selectedFile, filename)
              this.serviceProxy.SingleRequest(ServiceRegistry.UPLOAD_IMAGE, profileData).subscribe(data => {
                console.log(JSON.stringify(data) + "multer responsee");
                this.getName = data.filename;
                this.profileImageUpdate();
              })


            }
           

            this.presentToast("Successfully updated Details",2000,'success')
            this.router.navigate(['/tabs'])
          }
          else {
           // this.spinner.dismiss()
            this.presentToast("Failed to update details",2000,'warning')
          }
        },(async error=>{
          console.log(error)
            this.presentToast('Invalid Token.Please Login Again',2000,'danger')
            this.auth.logout()
           //await this.spinner.dismiss()
          
        }));

    }

  }
  async onFileChanged(event: any) {
    this.selectedFile = null;
    console.log("event", event);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      this.selectedFile = event.target.files[0];

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: ProgressEvent) => {
        this.previewUrl = (<FileReader>event.target).result;
        console.log(this.previewUrl);
      };
    }

  }
 
  profileImageUpdate() {

    let profiles = {
      id: this.tempID,
      image: this.getName,

    }

    this.serviceProxy.SingleRequest(ServiceRegistry.UPDATE_PROFILE_IMAGE, profiles).subscribe(data => {
     // this.spinner.dismiss()
      console.log(JSON.stringify(data) + "upload ressponse");
      const r = data;
      if (r.status === STATUS.OK) {

        TokenHelper.SaveUserDetails(data.result[0]);
        this.auth.currentUserSubject.next(data.result[0]);

      }
      else {
        this.presentToast("Failed to update details",2000,'warning')
      }
    })


  }
 


 

}
