import { AnalisadorService } from './../services/analisador.service';
import { Component } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { Router } from '@angular/router';
import { Crop } from '@ionic-native/crop/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  error: any = 'au';
  picture: string;

  cameraOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: 'rear',
    previewDrag: true,
    toBack: true,
    alpha: 1,
    tapToFocus: true,
    disableExifHeaderStripping: true
  };

  cameraPictureOpts: CameraPreviewPictureOptions = {
    width: window.innerWidth,
    height: window.innerHeight,
    quality: 100
  };
  newPicture: string;

  constructor(private cameraPreview: CameraPreview,
              public router: Router,
              private analiserService: AnalisadorService,
              private crop: Crop) { }


  ngOnInit(){
    this.startCamera();
  }
 

  startCamera() {
    this.picture = null;
    this.cameraPreview.startCamera(this.cameraOpts).then((res) => {
      this.error = res;
      console.log('Chamou pra abrir.');
    }).catch(error => {
      this.error = error;
      console.log('deu erro ao abrir a camera', error)
    });
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  takePicture() {
    this.cameraPreview.takePicture(this.cameraPictureOpts).then((res) => {
      this.picture = 'data:image/jpeg;base64,' + res;
      console.log('Entrou no take.')
      this.cameraPreview.stopCamera().then((res) => {
      }).catch(error => console.log('Deu erro pra fechar a camera:', error));
      
    }).catch(error => console.log('Deu erro no take', error));

  }

  avancar(): void {
    this.router.navigate(['/tabs/tab3']).then(()=>{
      
        this.analiserService.setImagem(this.picture);
      
    })
  }

  cortar(picture:any): any {
    this.crop.crop(picture, {quality: 100})
  .then(newImage => {this.newPicture = newImage},
    error => this.error = error);
  }
}
