import { Component, ViewChild } from '@angular/core';
import chartJs from 'chart.js';
import { Router } from '@angular/router';
import { AnalisadorService } from '../services/analisador.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('barCanvas') barCanvas;

  @ViewChild('barCanvas2') barCanvas1;

  @ViewChild('barCanvas3') barCanvas2;

  mensagem: string = '';
  resposta: any;
  listaR: number[];
  listaG: number[];
  listaB: number[];
  barChart: any;
  barChart1: any;
  barChart2: any;

  arquivo: any;
  caminho: any;

  x =  '[0, 1, 5, 8, 13, 23, 25, 32, 41, 47, 72, 97, 123, 159, 183, 220, 248, 268, 326, 423, 598, 903, 1386, 2027, 2672, 2889, 2836, 2441, 2166, 1990, 2090, 1955, 1579, 1402, 1542, 1719, 1939, 1639, 1325, 1108, 1034, 1150, 1384, 1570, 1942, 2244, 2863, 3772, 4939, 5934, 6113, 5534, 5340, 5126, 4684, 4081, 2315, 932, 326, 229, 231, 258, 284, 318, 325, 407, 386, 460, 553, 581, 628, 640, 655, 591, 552, 573, 579, 612, 717, 780, 792, 839, 835, 697, 652, 608, 538, 600, 547, 523, 529, 501, 522, 538, 506, 497, 491, 528, 491, 497, 524, 489, 526, 515, 507, 536, 561, 647, 662, 674, 690, 693, 731, 651, 686, 760, 828, 808, 697, 694, 617, 738, 792, 851, 837, 846, 938, 896, 896, 898, 654, 503, 463, 414, 428, 404, 426, 375, 385, 424, 451, 426, 442, 439, 379, 332, 380, 396, 325, 358, 390, 387, 408, 472, 435, 408, 410, 358, 398, 384, 383, 394, 401, 460, 490, 549, 595, 792, 872, 1061, 1228, 1489, 1805, 2132, 2239, 2367, 2462, 2632, 2569, 2064, 1903, 1803, 1559, 1040, 937, 941, 713, 593, 713, 682, 851, 991, 883, 1056, 1180, 1447, 1615, 1651, 1951, 2144, 2905, 3648, 3495, 2701, 1653, 1210, 1887, 2304, 2351, 634, 93, 62, 53, 58, 45, 75, 37, 11, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]';
  array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
       '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66',
        '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100',
         '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127',
          '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154',
           '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181',
            '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208',
             '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235',
              '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255'];
  teste: any[]=[];

  constructor(public router: Router,
              private analiserService: AnalisadorService,
              private file: File){

  }

  ngOnInit(){
    if(this.analiserService.getImagem()){     
      this.mensagem = this.analiserService.getImagem();
           
    }
  }

  ionViewWillEnter(){
    this.mensagem = this.analiserService.getImagem();
    this.geraHisto();
  }


  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getBarChart(contexto: any, dados: any, cor: any){
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
       '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66',
        '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100',
         '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127',
          '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154',
           '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181',
            '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208',
             '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235',
              '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255'];
    const data = {
      labels: array,
      datasets: [{
        label: 'intensidade de pixels',
        data: dados,
        backgroundColor: cor,         
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(contexto.nativeElement, 'bar', data, options);
  }

  ngAfterViewInit(){
   if(this.mensagem !== this.analiserService.getImagem()){
      this.mensagem = this.analiserService.getImagem();
    } 
  }

  avancar(): void {
    this.router.navigate(['/tabs/tab1']).then(()=>{})
  }

  geraHisto(){
    this.analiserService.outra(this.mensagem).subscribe(lista => {
      this.listaR =  this.tratar(lista.histo[0]);
      this.listaG =  this.tratar(lista.histo[1]);
      this.listaB =  this.tratar(lista.histo[2]);
      this.resposta = lista;
      this.analiserService.resposta.push(this.listaR);
      this.analiserService.resposta.push(this.listaG);
      this.analiserService.resposta.push(this.listaB); 

      this.barChart = this.getBarChart(this.barCanvas, this.listaR, 'rgb(255, 0, 0)');
      this.barChart1 = this.getBarChart(this.barCanvas1, this.listaG, 'rgb(156, 230, 20)');
      this.barChart2 = this.getBarChart(this.barCanvas2, this.listaB, 'rgb(20, 0, 255)');
    }, error => {
      alert('Erro ao gerar histograma:' + error.error);
      this.resposta = error;
    });
  }

  tratar(res:string): number[] {
    let lista = res.split(',');
    let size = lista.length;
    lista[0] = lista[0].split('[')[1];
    lista[(size-1)] = lista[(size-1)].split(']')[0];
    return lista.map(item => parseInt(item, 10));
  }


  options: any = {
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    showTitle: false,
    title: 'Histogramas',
    useBom: false,
    noDownload: false,
    headers: false
  };

  geraCsv() {
    this.arquivo = new ngxCsv(this.analiserService.resposta, 'ArquivoHistograma', this.options);
  }


  criarPasta(){
    return this.file.createDir(this.file.externalApplicationStorageDirectory, 'csv', true).then((res)=>{
      alert('A pasta foi criada: ' + res.toURL());
      this.caminho =  res.toURL()
    })
  }

  salvaArquivo(){
    const data = Date.now().toString();
    let nomeArquivo = `Histograma-${data}.csv`;
    this.file.writeFile(this.caminho, nomeArquivo, this.arquivo).then((res)=>{
      alert('Arquivo foi salvo!' + this.caminho);
    }).catch(error => {
      alert('Não foi possível salvar!' + error);
      console.log(error);
    })
  }

  async salvarResultado(){
    this.geraCsv();
    await this.criarPasta();
    await this.salvaArquivo();

  }
}
