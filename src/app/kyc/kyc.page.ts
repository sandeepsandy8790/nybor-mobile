import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { ServiceProxy, ServiceRegistry } from '../_helpers/ServiceProxy';
import { MediaCapture, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { Iaadhar, STATUS } from '../_models/aadhar';
import { IKYC } from '../_models/kyc';
import { Router } from '@angular/router';
import { TokenHelper } from '../_helpers/TokenHelper';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.page.html',
  styleUrls: ['./kyc.page.scss'],
})
export class KycPage implements OnInit {

  kycDocuments: any = [
    { id: 0, documentType: "Passport" },
    { id: 1, documentType: "Voter Card" },
    { id: 2, documentType: "Driving Licence" },
    { id: 3, documentType: "Aadhaar Card" },
    { id: 4, documentType: "PAN Card" },
  ]
  private kycForm: FormGroup;
  selectedFile: any;
  uploadViewStatus: any;
  currentUser:Iaadhar;

  constructor(private formBuilder: FormBuilder,
    public alertController: AlertController,
    private serviceProxy: ServiceProxy,
    private mediaCapture: MediaCapture,
    private router: Router,
    private auth: AuthService,
    private toastController: ToastController,) { }

  ngOnInit() {
    this.kycForm = this.formBuilder.group({
      kyc_document: ['', Validators.required],
      fileInput: ['', Validators.required]
    });
    this.auth.currentUserSubject.subscribe((data) => {
      console.log(data)
      this.currentUser = data;
    });
    //this.getUser();
  }

  getUser() {
    let currentUser = this.serviceProxy.SingleRequest(ServiceRegistry.GET_AADHAR_BY_ID, null).subscribe(data => {
      if (data.status == STATUS.OK && data.result!=null) {
        this.uploadViewStatus = data.result[0].kycStatus
        console.log(data.result[0].kycStatus)
      }
      else {
        this.uploadViewStatus = null
      }
    })
  }

  kycSubmit() {
    console.log(this.kycForm.value);
    let kyc_submit: IKYC = {
      documentType: this.kycForm.value.kyc_document,
      fileInput: this.kycForm.value.fileInput
    }
    this.serviceProxy.SingleRequest(ServiceRegistry.UPDATE_KYC, kyc_submit).subscribe(data => {
      console.log(data)
      TokenHelper.SaveUserDetails(data.result);
      this.auth.currentUserSubject.next(data.result);
      // tab1
      this.showtoast()
      setTimeout(() => {
        this.router.navigate(['/tabs'])
      }, 2000);
     
    });

  }
  async doMediaCapture() {
    // let options: VideoCapturePlusOptions = { limit: 1, duration: 30 };
    // let capture:any = await this.videoCapturePlus.captureVideo(options);
    // console.log((capture[0] as MediaFile).fullPath)


    // let options: CaptureImageOptions = { limit: 3 };
    // this.mediaCapture.captureImage(options)
    //   .then(
    //     (data: MediaFile[]) => console.log(data),
    //     (err: CaptureError) => console.error(err)
    //   );

  };

  async presentAlert(filename) {
    const alert = await this.alertController.create({
      header: 'Document Upload',
      // subHeader: filename,
      message: 'Nybor would like to upload this document for your KYC Verification?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log("!!!!!!", this.selectedFile.name)
            this.updateKYC()
          }
        }
      ]
    });

    await alert.present();
  }

  async onFileChanged(event: any) {
    this.selectedFile = null;
    console.log("event", event);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      this.selectedFile = event.target.files[0];

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: ProgressEvent) => {
        // this.previewUrl = (<FileReader>event.target).result;
        // console.log(this.previewUrl);
      };
    }
    if (event.srcElement.files[0].type === "image/jpeg") {
      await this.presentAlert(event.srcElement.files[0].name);
    }
    if (event.srcElement.files[0].type === "image/png") {
      await this.presentAlert(event.srcElement.files[0].name);
    }
    if (event.srcElement.files[0].type === "image/jpg") {
      await this.presentAlert(event.srcElement.files[0].name);
    }
    if (event.srcElement.files[0].type === "application/pdf") {
      await this.presentAlert(event.srcElement.files[0].name);
    }
    if (event.srcElement.files[0].name.split('.')[1].toLowerCase() === "docx") {
      await this.presentAlert(event.srcElement.files[0].name);
    }
    if (event.srcElement.files[0].name.split('.')[1].toLowerCase() === "doc") {
      await this.presentAlert(event.srcElement.files[0].name);
    } else {
      // this.imageFile = true;
    }
  }

  updateKYC() {
    if (this.selectedFile) {
      //service routes
      const kycFile = new FormData()
      kycFile.append('kycFile', this.selectedFile, this.selectedFile.name)
      console.log(kycFile, "chatImages");
      this.serviceProxy.SingleRequest(ServiceRegistry.UPDATE_KYC_FILE, kycFile).subscribe(data => {
        console.log(data)
        this.kycForm.controls['fileInput'].setValue(data.name);
        console.log(this.kycForm.value)
      })
      this.selectedFile = null;
      // this.previewUrl = '';
      // this.pdfFile = false;
    }
  }
 async  showtoast(){
    const toast = await this.toastController.create({
      color: 'success',
      duration: 2000,
      message: 'Documents Uploaded',
      // showCloseButton: true
    });
    await toast.present();
  }

}
