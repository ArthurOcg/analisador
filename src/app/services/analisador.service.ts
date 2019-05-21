import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalisadorService {

  imagem: string;

  resposta: any;

  constructor(public http: HttpClient) { }

  setImagem(img:string):void {
    this.imagem = img;
  }

  getImagem(): string {
    return this.imagem;
  }

  outra(img: string): Observable<any> {
    let headers = new HttpHeaders({'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'});
    let url2='http://analize.herokuapp.com/analize'
    let data = {"imagem": img}
    return this.http.post(url2, data, {headers: headers});
  }
}
