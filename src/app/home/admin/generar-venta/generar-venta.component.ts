import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ClientesService } from "./../_services/clientes.service";
import { ProductosService } from "./../_services/productos.service";
import { InventarioService } from "./../_services/inventario.service";
import { TiposVentaService } from "./../_services/tipos-venta.service";
import { VentasService } from "./../_services/ventas.service";
import { TiposProductoService } from "./../_services/tipos-producto.service";

import { NotificationsService } from 'angular2-notifications';

declare var $: any

@Component({
  selector: 'app-generar-venta',
  templateUrl: './generar-venta.component.html',
  styleUrls: ['./generar-venta.component.css']
})
export class GenerarVentaComponent implements OnInit {
  title:string="Venta"
  Table:any
  TableDet:any = []
  productos:any
  comboTiposCompra:any
  comboTiposProducto:any
  selectedData:any
  comprob:number
  idRol=+localStorage.getItem('currentRolId');
  idUser=+localStorage.getItem('currentId');
  Agregar = +localStorage.getItem('permisoAgregar')
  Modificar = +localStorage.getItem('permisoModificar')
  Eliminar = +localStorage.getItem('permisoEliminar')
  Mostrar = +localStorage.getItem('permisoMostrar')
  contFila:number=0
  Total:number=0
  prov:any = {
    direccion:"",
    id:0,
    nit:"",
    nombre:"",
    telefono:''
  }
  prod:any = {
    productos:{
      codigo:"",
      id:0,
      descripcion:"",
      nombre:"",
      tipo:'',
      marcaDes:''
    }
  }
  fechaHoy:any
  public rowsOnPage = 5;
  public search:any
  public searchterm:any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: NotificationsService,
    private mainService: ProductosService,
    private parentService: TiposVentaService,
    private InventarioService: InventarioService,
    private secondParentService: TiposProductoService,
    private secondService: ClientesService,
    private firstMainService: VentasService
  ) { }

  ngOnInit() {
    let date = new Date();
    let month = date.getMonth()+1;
    let month2;
    let dia= date.getDate();
    let dia2;
    if(month<10){
      month2='0'+month;
    }else{
      month2=month
    }
    if(dia<10){
      dia2='0'+dia;
    }else{
      dia2=dia
    }
    this.fechaHoy= date.getFullYear()+'-'+month2+'-'+dia2
    this.cargarAll()
    this.cargarProds()
    this.cargarCombos()
    this.colapsse()
    this.comprobante()
  }
  colapsse(){
    if($('.page-container').hasClass('page-navigation-toggled')){

    }else{
      $('.page-container').addClass('page-navigation-toggled page-container-wide')
      $('#navigations').addClass('x-navigation-minimized')
      $('#nav-bar-menu').css('display','none')
      $('.xn-openable').removeClass("active");
    }
  }
  abrir(event:any){
    if(event.keyCode==13){
      if($('#nit').val()=='' && $('#nombre').val()==''){
        this.prov={};
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
  verifica(data,name)
  {

    $( "#precioClienteEs" ).prop( "disabled", true );
    $( "#precioVenta" ).prop( "disabled", true );
    $( "#precioDistribuidor" ).prop( "disabled", true );
    $( "#"+name ).prop( "disabled", false );
    // console.log(data);

  }
  buscar(text){
    let data:any = {
      nit:text
    }
    this.secondService.getSingleFind(data)
                      .then(response => {
                        this.prov=response
                        this.prov.tipo = 1
                        this.prov.nombre = this.prov.nombre+' '+this.prov.apellido
                        // console.log(response);
                        $("#secondModal .close").click();
                        $('#tipo').focus();
                      }).catch(error => {
                        console.clear
                        this.prov={};
                        $('#secondModal').modal()
                        setTimeout(function(){
                          $('#insertModal').modal();
                          $('#insertModal #insert-form #nit').val(text)
                        },0);
                      })
  }

  seleccionar(data){
    this.prov=data
    this.prov.tipo = 1
    this.prov.nombre = this.prov.nombre+' '+this.prov.apellido
    $("#secondModal .close").click();
  }
  seleccionarProd(data){
    this.prod=data
    this.prod.cantidad = 1
    this.searchterm=data.productos.codigo
  }
  agregarVenta(formValue:any){
    $("#prodModal .close").click();
    formValue.precioClienteEs = $( "#precioClienteEs" ).val()
    formValue.precioDistribuidor = $( "#precioDistribuidor").val()
    formValue.sucursal = this.prod.sucursal
    if($( "#precioClienteEs" ).is(':enabled'))
    {
      formValue.precioVenta = $( "#precioClienteEs" ).val()
    }
    if($( "#precioDistribuidor" ).is(':enabled'))
    {
      formValue.precioVenta = $( "#precioDistribuidor").val()
    }
    this.contFila++
    this.Total+= (formValue.cantidad*formValue.precioVenta)
    formValue.rId = this.contFila
    formValue.subtotal = (formValue.cantidad*formValue.precioVenta)
    this.TableDet.push(formValue)
    $('#prod-form')[0].reset()
    this.searchterm = ""
    this.cargarProds()
    // console.log(formValue);
  }
  agregarInventario(formValue:any){
    formValue.comprobante = this.comprob
    formValue.total = this.Total
    formValue.detalle = this.TableDet
    // console.log(formValue);
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    this.firstMainService.create(formValue)
                      .then(response => {
                        console.clear
                        this.create('Proveedor Ingresado')
                        $('#Loading').css('display','none')
                        this.router.navigate([`home/admin/ventas`])
                      }).catch(error => {
                        console.clear
                        if(error.status==401){
                          console.clear
                          this.createError(error._body.substring(25,55))
                        }else{
                          this.createError(error)
                        }
                        $('#Loading').css('display','none')
                      })

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

  cargarCombos(){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    this.parentService.getAll()
                      .then(response => {
                        this.comboTiposCompra = response
                        this.secondParentService.getAll()
                                            .then(response => {
                                              this.comboTiposProducto = response
                                              $('#Loading').css('display','none')
                                              console.clear
                                            }).catch(error => {
                                              console.clear
                                              this.createError(error)
                                              $('#Loading').css('display','none')
                                            })
                        console.clear
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })
  }

  async cargarProds(){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    let sucursal = localStorage.getItem('currentSucursal')
    if(+sucursal){
        let data = {
          id:0,
          state:sucursal,
          filter:'sucursal'
        }
      await this.InventarioService.getAllFilter(data)
                        .then(response => {
                          this.productos = response
                          $('#Loading').css('display','none')
                        }).catch(error => {
                          console.clear
                          this.createError(error)
                          $('#Loading').css('display','none')
                        })
    }else{
      await this.InventarioService.getAll()
                                .then(response => {
                                  response.forEach(element => {
                                    element.productos.inventario = element
                                  });
                                  this.productos = response
                                  $('#Loading').css('display','none')
                                  console.clear
                                }).catch(error => {
                                  console.clear
                                  this.createError(error)
                                  $('#Loading').css('display','none')
                                })
    }

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

  insertProd(formValue:any){
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')

    this.mainService.create(formValue)
                      .then(response => {
                        this.cargarProds()
                        this.seleccionarProd(response)
                        console.clear
                        this.create('Productos Ingresado')
                        $('#Loading').css('display','none')
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

  comprobante(){
    this.firstMainService.getComprobante()
                      .then(response => {
                        this.comprob = +response.comprobante+1;
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
                        $("#editModal .close").click();
                        $("#insertModal .close").click();
                        $('#Loading').css('display','none')
                        console.clear
                        this.create('Proveedor Actualizado exitosamente')
                      }).catch(error => {
                        console.clear
                        this.createError(error)
                        $('#Loading').css('display','none')
                      })

  }
  deleteDet(e:any){
    this.Total-= (e.cantidad*e.precioVenta)
    this.TableDet.splice(this.TableDet.findIndex(dat=>{
      return dat.rId==e.rId
    }),1)
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
