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

  error: any;
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

  ionViewWillEnter() {

  }



  startCamera() {
    this.picture = null;
    this.cameraPreview.startCamera(this.cameraOpts).then((res) => {
      console.log('Abriu a camera.');
    }).catch(error => {
      this.error = error;
      console.log('Deu erro ao abrir a camera', error)
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
      this.newPicture = null;
      this.analiserService.setImagem(null);
      console.log('Entrou no take.')
      this.cameraPreview.stopCamera().then((res) => {
      }).catch(error => console.log('Deu erro pra fechar a camera:', error));

    }).catch(error => console.log('Deu erro no take', error));

  }

  avancar(): void {
    this.router.navigate(['/tabs/tab3']).then(() => {
      if (this.newPicture) {
        this.analiserService.setImagem(this.newPicture);
      } else {
        alert('Não foi realizado o corte da imagem, ela será analisada por completa!');
        if(this.picture){
          this.analiserService.setImagem(this.picture);
        }
      }
    })
  }

  cortar(path: any): any {
    this.crop.crop(this.localArquivo, { quality: 100 })
      .then(pathCorte => {
        const nome = pathCorte.split('/');
        const caminho = pathCorte.split('cache');
        let quantidade = nome.length;
        let nomearq = nome[(quantidade - 1)].split('?');
        alert('Arraste a tela pra cima para visualizar o corte na imagem. Nome do novo arquivo: ' + nomearq[0]);
        this.file.readAsDataURL(`${caminho[0]}cache/`, nomearq[0]).then(res => {
          this.newPicture = res;
        }).catch(res => {
          this.error = { 'aqui e o erro do read': res };
        });
      }).catch(console.log);
  }

  criarPasta() {
    return this.file.createDir(this.file.externalApplicationStorageDirectory, 'AnalisadorPIC', true).then((path) => {
      console.log('Foi criado a pasta AnalisadorPIC.' + path.toURL())
      this.fileUrl = path.toURL();
    }).catch(error => {
      this.error = error
    })
  }

  salvarFoto(path) {
    let nomeArquivo = `Image-${Date.now().toString()}.jpeg`;
    let blob = this.convertParaBlob(this.picture);
    return this.file.writeFile(path, nomeArquivo, blob).then((ui) => {
      alert('Salvou na pasta' + path);
      this.localArquivo = `${path}${nomeArquivo}`;
      this.error = ui;
    }).catch(error => this.error = error);
  }

  convertParaBlob(data): Blob {
    const separado = data.split(',');
    const img = atob(separado[1]);
    let n = img.length;
    const array8 = new Uint8Array(n);
    while (n--) {
      array8[n] = img.charCodeAt(n)
    }
    return new Blob([array8], { type: 'image/jpeg' });
  }

  async capturaFoto() {
    await this.criarPasta();
    await this.takePicture();
    await this.salvarFoto(this.fileUrl);
  }

}
