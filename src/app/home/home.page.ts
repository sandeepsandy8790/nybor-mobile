import { Component, OnInit } from "@angular/core";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IGender, Iaadhar, STATUS } from "../_models/aadhar";
import { AuthService } from "../_services/auth.service";
import { ServiceProxy, ServiceRegistry } from '../_helpers/ServiceProxy';
import { TokenHelper } from '../_helpers/TokenHelper';
import { Router } from '@angular/router';
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  gender: IGender[];
  selectedGender: IGender;
  dob: any;
  userProfileForm: FormGroup;
  date: Array<number> = new Array();
  year: Array<number> = new Array();
  userProfile: Iaadhar;
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
  constructor(
    private fb: Facebook,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private serviceProxy: ServiceProxy,
    private router:Router
  ) {
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
    });
  }
  ngOnInit() {
    this.auth.currentUserSubject.subscribe((data) => {
      this.userProfile = data;
    });
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
  fbLogin() {
    this.fb
      .login(["public_profile", "user_friends", "email"])
      .then((res) => {
        if (res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch((e) => console.log("Error logging into Facebook", e));
  }
  getUserDetail(userid: any) {
    this.fb
      .api("/" + userid + "/?fields=id,email,name,picture", ["public_profile"])
      .then((res) => {
        console.log(res);
        this.users = res;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  logout() {
    this.fb
      .logout()
      .then((res) => (this.isLoggedIn = false))
      .catch((e) => console.log("Error logout from Facebook", e));
  }

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
  onSubmit() {
    if(this.userProfileForm.invalid){
      alert("Please Fill all Details")
    }
    else{
      let userProfile: Iaadhar = new Iaadhar();
      userProfile = this.userProfileForm.value;
      userProfile.gender = this.selectedGender;
      let profile={
        personalProfile:userProfile
      }
      console.log(userProfile);
      this.serviceProxy.SingleRequest(ServiceRegistry.UPDATE_PROFILE, profile)
      .subscribe(arg => {
      
        const r = arg;
 
        if (r.status === STATUS.OK) {
          TokenHelper.SaveUserDetails(arg.result);
          this.auth.currentUserSubject.next(arg.result);
          alert("Update Success")
          this.router.navigate(['/tabs'])
        }
        else{
          alert("something went wrong try again")
        }

      });
    }
  
  }
}
