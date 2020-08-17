import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingspinnerService {
  isLoading = false;
  constructor(public loadingController:LoadingController) { }
  async present() {
    this.isLoading = true;
    // const loading = await this.loadingController.create({
    //   message: 'Please Wait...',
    // });
    // return loading.present();
    return await this.loadingController.create({
      spinner:'bubbles',
      message:'Please wait',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
       
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
}
