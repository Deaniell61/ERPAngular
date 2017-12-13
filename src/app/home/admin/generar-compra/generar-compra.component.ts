import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from "./../_services/proveedores.service";

import { NotificationsService } from 'angular2-notifications';

declare var $: any

@Component({
  selector: 'app-generar-compra',
  templateUrl: './generar-compra.component.html',
  styleUrls: ['./generar-compra.component.css']
})
export class GenerarCompraComponent implements OnInit {
  title:string="Compra"
  Table:any
  selectedData:any
  idRol=+localStorage.getItem('currentRolId');
  Agregar = localStorage.getItem('permisoAgregar')
  Modificar = localStorage.getItem('permisoModificar')
  Eliminar = localStorage.getItem('permisoEliminar')
  Mostrar = localStorage.getItem('permisoMostrar')
  public rowsOnPage = 5;
  public search:any
  constructor(
    private _service: NotificationsService,
    private secondService: ProveedoresService
  ) { }

  ngOnInit() {
    this.cargarAll()
  }
  abrir(event:any){
    if(event.keyCode==13){
      if($('#nit').val()=='' && $('#nombre').val()==''){
        $('#secondModal').modal()
      }else{
        if($('#nit').val()!=''){
          this.buscar($('#nit').val())
        }else
        if($('#nombre').val()!=''){
          this.buscar($('#nombre').val())
        }
      }
    }

  }
  buscar(text){

  }

  seleccionar(data){

  }

  cargarAll(){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    this.secondService.getAll()
                      .then(response => {
                        this.Table = response
                        $('#Loading').css('display','none')
                        console.clear
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })
  }

  insert(formValue:any){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')

    this.secondService.create(formValue)
                      .then(response => {
                        this.cargarAll()
                        console.clear
                        this.create('Proveedor Ingresado')
                        $("#editModal .close").click();
                        $("#insertModal .close").click();
                        $('#Loading').css('display','none')
                        $('#insert-form')[0].reset()
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })


  }

  cargarSingle(id:number){
    this.secondService.getSingle(id)
                      .then(response => {
                        this.selectedData = response;
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                      })
  }

  update(formValue:any){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    //console.log(data)
    this.secondService.update(formValue)
                      .then(response => {
                        this.cargarAll()
                        console.clear
                        this.create('Proveedor Actualizado exitosamente')
                        $('#Loading').css('display','none')
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })

  }

  delete(id:string){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    if(confirm("¿Desea eliminar el Proveedor?")){
      this.secondService.delete(id)
                        .then(response => {
                          this.cargarAll()
                          console.clear
                          this.create('Proveedor Eliminado exitosamente')
                          $('#Loading').css('display','none')
                        }).catch(error => {
                          console.clear
                          this.createError(error)
                          $('#Loading').css('display','none')
                        })
    }else{
      $('#Loading').css('display','none')
    }

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
