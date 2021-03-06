import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Iaadhar } from '../_models/aadhar';
import { ServiceProxy, ServiceRegistry } from '../_helpers/ServiceProxy';
import { TokenHelper } from '../_helpers/TokenHelper';

declare var google;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  url = this.serviceProxy.BASE_URL + '/';
  profileImage: any;
  userProfile: Iaadhar;
  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  enable: boolean;
  gender:any
  currentUser: any;
  constructor(private geolocation: Geolocation, public menuController: MenuController, private router: Router, private auth: AuthService, private serviceProxy: ServiceProxy,) {
    
   }
   ngOnInit(){
    this.auth.currentUserSubject.subscribe((data) => {
      console.log(data)
      this.currentUser = data;
    });
    // this.currentUser = JSON.parse(TokenHelper.GetUserDetails())
    // console.log(this.currentUser.kycStatus)
   }

   //get latest user details 

   async getUserDetails(){
    this.auth.currentUserSubject.subscribe((data) => {
      console.log(data)
      this.currentUser = data;
    });
    const aadhar: Iaadhar = new Iaadhar();
    aadhar.mobileNumber = this.currentUser.mobileNumber;
    await this.serviceProxy.SingleRequest(ServiceRegistry.GET_AADHAR_BY_MOBILE, aadhar)
    .subscribe(async (arg) => {
      TokenHelper.SaveUserDetails(arg.result[0]);
      this.auth.currentUserSubject.next(arg.result[0]);

    })
   }

  ionViewDidEnter() {
    this.getUserDetails();
    this.auth.currentUserSubject.subscribe((data) => {
      this.userProfile = data;
      console.log(this.userProfile)
      this.gender=this.userProfile.gender['gender']
      this.profileImage = this.userProfile.image;
      this.enable = true;
    });
    //this.getUserPosition();
  }
  openSideMenu() {
    this.menuController.enable(true, 'first');
    this.menuController.open('first');
  }
  editProfile() {
    this.menuController.close('first');
    this.router.navigate(['/profile'])
  }

  updateKYC(){
    this.menuController.close('first');
    this.router.navigate(['/kyc']);
  }
  addFamily(){
    this.menuController.close('first');
    this.router.navigate(['addfamily']);
  }
  logout(){
    this.menuController.close('first');
    TokenHelper.RemoveLoginToken();
    TokenHelper.RemoveUserDetails();
    this.router.navigate(['/login'])
    
  }
  changeMobileNumber(){
    this.menuController.close('first');
    this.router.navigate(['/mobilenumberchange'])
  }
  getUserPosition() {
    this.options = {
      enableHighAccuracy: false
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;

      console.log(pos);
      this.addMap(pos.coords.latitude, pos.coords.longitude);

    }, (err: PositionError) => {
      console.log("error : " + err.message);
      ;
    })
  }
  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();

  }
  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

}
