import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

declare var google;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(private geolocation: Geolocation,public menuController: MenuController,private router:Router) { }
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
  ionViewDidEnter() {
    this.getUserPosition();
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
  openSideMenu() {
    this.menuController.enable(true, 'first');
    this.menuController.open('first');
  }
  editProfile(){
    this.menuController.close('first');
    this.router.navigate(['/home'])
  }
}
