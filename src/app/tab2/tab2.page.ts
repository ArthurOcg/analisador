import { AnalisadorService } from './../services/analisador.service';
import { Component } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { Router } from '@angular/router';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  error: any = 'au';
  picture: string;
  localArquivo: string;

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
    private file: File,
    private base64ToGallery: Base64ToGallery) { }


  ngOnInit() {
    this.startCamera();
  }

  ionViewWillEnter() {
    this.file.checkDir(this.file.externalApplicationStorageDirectory, 'AnalisadorPIC').then((res) => {
      console.log('a pasta existe: ' + res);
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
      return this.cameraPreview.takePicture(this.cameraPictureOpts).then((res) => {
      this.picture = 'data:image/jpeg;base64,' + res;
      this.base64ToGallery.base64ToGallery(this.picture).then((ponse)=>{
        console.log(ponse);
        this.respData = ponse;
      }).catch(console.log)
      console.log('Entrou no take.')
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
    this.crop.crop(this.localArquivo, { quality: 100 })
      .then(newImage => { this.newPicture = newImage }).catch(console.log);
  }

  criarPasta() {
    return this.file.createDir(this.file.externalApplicationStorageDirectory, 'AnalisadorPIC', true).then((path) => {
      alert('Foi criado a pasta Pictures.' + path.toURL())
      this.fileUrl = path.toURL();
      if (this.picture) {
        
      }
    }).catch(error => {
      this.error = error
    })
  }

  salvarFoto(path){
    let nomeArquivo = `Image-${Date.now().toString()}.jpeg`;
    let blob = new Blob([this.picture], { type: 'image/jpeg' })
        return this.file.writeFile(path, nomeArquivo, blob).then((ui) => {
          alert('Salvou na pasta' + path);
          this.localArquivo = `${path}${nomeArquivo}`;
          this.error = ui;
        }).catch(error => this.error = error);
  }

  async capturaFoto(){
    await this.criarPasta();
    await this.takePicture();
    await this.salvarFoto(this.fileUrl);
  }

}
