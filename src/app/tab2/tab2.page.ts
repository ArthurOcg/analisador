import { AnalisadorService } from './../services/analisador.service';
import { Component } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { Router } from '@angular/router';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';


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

  corte: CameraPreviewDimensions = {
    height: 300,
    width: 300
  }

  newPicture: string;
  fileUrl: any = null;
  respData: any;

  constructor(private cameraPreview: CameraPreview,
    public router: Router,
    private analiserService: AnalisadorService,
    private crop: Crop,
    private file: File) { }


  ngOnInit() {
    this.startCamera();
  }

  ionViewWillEnter(){
    this.file.checkDir(this.file.externalApplicationStorageDirectory,'AnalisadorPIC').then((res)=>{
      console.log('a pasta existe: '+ res);
      this.error = res;
    })

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

  fixarFoco(): void {
    this.cameraPreview.setFocusMode(this.cameraPreview.FOCUS_MODE.FIXED);
  }
  autoFoco(): void {
    this.cameraPreview.setFocusMode(this.cameraPreview.FOCUS_MODE.CONTINUOUS_PICTURE);
  }


  takePicture() {
    this.criarPasta();
    this.cameraPreview.takePicture(this.cameraPictureOpts).then((res) => {
      this.picture = 'data:image/jpeg;base64,' + res;
      console.log('Entrou no take.')
      /* this.file.resolveDirectoryUrl(this.fileUrl).then((e)=>{
        this.fileUrl = e;
      }); */

      this.cameraPreview.stopCamera().then((res) => {
      }).catch(error => console.log('Deu erro pra fechar a camera:', error));

    }).catch(error => console.log('Deu erro no take', error));

  }

  avancar(): void {
    this.router.navigate(['/tabs/tab3']).then(() => {

      this.analiserService.setImagem(this.picture);

    })
  }

  cortar(path: any): any {
    this.crop.crop(path + 'Image-'+Date.now()+'.jpg', { quality: 100 })
      .then(newImage => { this.newPicture = newImage },
        error => this.error = error);
  }

  criarPasta(): void {
    this.file.createDir(this.file.externalApplicationStorageDirectory, 'AnalisadorPIC', true).then((path) => {
      alert('Foi criado a pasta Pictures.' + path.toURL())
      this.fileUrl = path.toURL();
      if (this.picture) {
        //let blob = new Blob([this.picture], { type: 'image/jpg' })
        this.file.writeFile(path.toURL(), 'Image-'+Date.now().toString()+'.jpg', this.picture).then((ui) => {
          alert('Salvou na pasta' + path.toURL());
          this.error = ui;
        }).catch(error => this.error = error);
      }
    }).catch(error => {
      this.error = error
    })
  }

}
