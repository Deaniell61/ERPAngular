import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from "./../_services/estadisticas.service";

import { NotificationsService } from 'angular2-notifications';

declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title:string="Dashboard"
  Table:any
  idRol=+localStorage.getItem('currentRolId');
  Agregar = +localStorage.getItem('permisoAgregar')
  Modificar = +localStorage.getItem('permisoModificar')
  Eliminar = +localStorage.getItem('permisoEliminar')
  Mostrar = +localStorage.getItem('permisoMostrar')
  selectedData:any
  public rowsOnPage = 5;
  public search:any
  fechaHoy:any
  fechaMes:any
  constructor(
    private _service: NotificationsService,
    private mainService: EstadisticasService
  ) { }
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartLabels:string[] = [];

  public barChartData:any[] = [
    {data:[],label:'Vacio'}
  ];

   public pieChartLabels:any[];
   public pieChartData:any=[];
   public pieChartType:string = 'pie';

  ngOnInit() {
    this.getDate();
    this.cargarPie();
    this.cargarDias();
    this.cargarBarra();
    setTimeout(() => {
      this.cargarDias();
      this.cargarBarra();
    }, 500);
  }
  cargarDias(){
    let dias;
    let array:any = []
    this.barChartLabels.length = 0
    dias = this.fechaMes
    let fechaInicio = new Date(dias).getTime();
    let fechaFin    = new Date(this.fechaHoy).getTime();
    this.barChartLabels.length=0;
    let diff = fechaFin - fechaInicio;
    dias = (diff/(1000*60*60*24))
    var hoy = new Date(this.fechaMes);
    for(let i=1;i<=(dias+1);i++){
      var calculado = new Date(this.fechaMes);
      calculado.setDate(
        (hoy.getDate()) + i
      );
      let fecha = calculado.getFullYear() + '-' +(((calculado.getMonth() + 1)<10)?'0'+(calculado.getMonth() + 1):(calculado.getMonth() + 1)) + '-' + ((calculado.getDate()<10)?'0'+calculado.getDate():calculado.getDate());
      array.push(fecha)
    }

    this.barChartLabels = array

  }
  getDate(){
    let date = new Date();
    let month = date.getMonth()+1;
    let month2;
    let diaB = date.getDate()-1;
    let diaB2;
    let dia= date.getDate();
    let dia2;
    if(month<10){
      month2='0'+month;
    }else{
      month2=month
    }
    if(diaB<10){
      diaB2='0'+diaB;
    }else{
      diaB2=diaB
    }
    if(dia<10){
      dia2='0'+dia;
    }else{
      dia2=dia
    }
    this.fechaHoy= date.getFullYear()+'-'+month2+'-'+dia2
    this.fechaMes= date.getFullYear()+'-'+month2+'-'+diaB2
  }
  cargarBarra(){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    let data = {
      fechaInicio: this.fechaMes,
      fechaFin: this.fechaHoy
    }
    this.mainService.getBarVentas(data)
                      .then(response => {
                        if(response){
                          let fortex:any = []
                          fortex.length = 0
                          response.forEach((element,index) => {
                              let dat = {
                                label:'Ventas',
                                data:[]
                              }
                              let bandera = 0
                              this.barChartLabels.forEach((element2,x) => {
                                if(element2==element.fecha){
                                  if(fortex.find((element1,i) => {
                                     return element1.label=='Ventas'
                                  })){
                                    fortex[fortex.findIndex((element1,i) => {
                                      return element1.label=='Ventas'
                                   })].data[x]=element.total
                                        bandera=1
                                  }else{
                                    dat.data.push(element.total)

                                  }
                                }else{
                                  dat.data.push(0)
                                }
                              })
                              if(bandera==0){
                                fortex.push(dat)
                              }

                          });
                          if(fortex.length>0){
                            this.barChartData = fortex;
                          }

                        }
                        // console.log(this.barChartLabels);
                        // console.log(this.barChartData)

                        $('#Loading').css('display','none')
                        console.clear
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })
  }

  cargarPie(){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    let data = {
      fechaInicio: this.fechaMes,
      fechaFin: this.fechaHoy
    }
    this.pieChartData = null
    this.pieChartLabels = null
    this.mainService.getPieVentas(data)
                      .then(response => {
                          let labels:any[] = []
                          let data:any[] = []
                          response.forEach((element,index) => {
                            labels.push(element.nombre)
                            data.push(element.total)

                          });
                          // if(fortex.length>0 && fortexData.length>0){
                          //   this.pieChartLabels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
                          //   this.pieChartData = [300, 500, 100];
                          // }else{
                          //   this.pieChartData = [0]
                          //   this.pieChartLabels = ["Vacio"]
                          // }
                          this.pieChartLabels=labels
                          this.pieChartData=data
                        // console.log(this.pieChartLabels);
                        // console.log(this.pieChartData)

                        $('#Loading').css('display','none')
                        console.clear
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })
  }

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: false,
    animate: "fromLeft",
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
};

create(success) {
     this._service.success('¡Éxito!',success)

}
createError(error) {
     this._service.error('¡Error!',error)

}
}
