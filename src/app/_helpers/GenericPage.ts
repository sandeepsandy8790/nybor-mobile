import { Injector } from '@angular/core';
import { ServiceProxy,  } from '../_helpers/ServiceProxy';
import { ToastController,} from '@ionic/angular';
import { Router } from '@angular/router';


export class GenericPage {
  public toastController: ToastController;
  public serviceProxy: ServiceProxy;
  public router: Router;
  isLoading = false;
  constructor(public injector: Injector, ) {
    this.toastController = injector.get(ToastController);
    this.serviceProxy = this.injector.get(ServiceProxy);
    this.router = this.injector.get(Router);
   
  }

  async presentToast(content: string, time: number, color) {
    const toast = await this.toastController.create({
      message: content,
      duration: time,
      animated: true,
      position: 'bottom',
      color,
    });
    toast.present();
  }
 

  
}
