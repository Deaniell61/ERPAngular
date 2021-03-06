import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ProveedoresService } from "./../_services/proveedores.service";
import { ProductosService } from "./../_services/productos.service";
import { TiposCompraService } from "./../_services/tipos-compra.service";
import { InventarioService } from "./../_services/inventario.service";
import { ComprasService } from "./../_services/compras.service";
import { TiposProductoService } from "./../_services/tipos-producto.service";

import { SucursalesService } from "./../_services/sucursales.service";
import { NotificationsService } from 'angular2-notifications';

declare var $: any
let prods = []

@Component({
  selector: 'app-generar-compra',
  templateUrl: './generar-compra.component.html',
  styleUrls: ['./generar-compra.component.css']
})
export class GenerarCompraComponent implements OnInit {
  title:string="Compra"
  Table:any
  TableDet:any = []
  productos:any
  comboSucursalesProducto:any
  comboTiposCompra:any
  comboTiposProducto:any
  selectedData:any
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
    codigo:"",
    id:0,
    descripcion:"",
    nombre:"",
    tipo:'',
    marcaDes:''
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
    private parentService: TiposCompraService,
    private subParentService: SucursalesService,
    private InventarioService: InventarioService,
    private secondParentService: TiposProductoService,
    private secondService: ProveedoresService,
    private firstMainService: ComprasService
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
    // this.getProductos();
    this.cargarAll()
    this.cargarProds()
    this.cargarCombos()
    this.colapsse()
  }

  getProductos() {
    this.mainService.getAll()
                        .then(element =>{
                          let data=[]
                          element.forEach(element => {
                            data.push(element.nombre+" - "+element.descripcion+" - "+element.codigo)
                          });
                          prods=data;
                          this.productos = element
                          console.log(element);

                        }).catch(error => {
                          console.log("Error adquirido");

                        })
  }
  findChoices(searchText: string) {

    return prods
    .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, 5);

  }

  getChoiceLabel(choice: string) {
    return `@${choice} `;
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
  changeCalc(){
    this.prod.inventario.precioClienteEs    = this.prod.inventario.precioVenta-(this.prod.inventario.precioVenta*0.15)
    this.prod.inventario.precioDistribuidor = this.prod.inventario.precioVenta-(this.prod.inventario.precioVenta*0.20)
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
  buscar(text){
    let data:any = {
      nit:text
    }
    this.secondService.getSingleFind(data)
                      .then(response => {
                        this.prov=response
                        this.prov.tipo = 1
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
    $("#secondModal .close").click();
  }
  seleccionarProd(data){
    this.prod=data
    this.prod.inventario.cantidad = 0
    this.searchterm=data.codigo
  }
  agregarVenta(formValue:any){
    // console.log(formValue);
    $("#prodModal .close").click();
    this.contFila++
    this.Total+= (formValue.cantidad*formValue.precioCosto)
    formValue.rId = this.contFila
    formValue.subtotal = (formValue.cantidad*formValue.precioCosto)
    this.TableDet.push(formValue)
    $('#prod-form')[0].reset()
    this.searchterm = ""
    this.cargarProds()
  }
  agregarInventario(formValue:any){
    formValue.total = this.Total
    formValue.detalle = this.TableDet
    formValue.detalle = this.TableDet
    // console.log(formValue);
    $('#Loading').css('display','block')
    $('#Loading').addClass('in')
    this.firstMainService.create(formValue)
                      .then(response => {
                        console.clear
                        this.create('Proveedor Ingresado')
                        $('#Loading').css('display','none')
                        this.router.navigate([`home/admin/compras`])
                      }).catch(error => {
                        console.clear
                        this.createError(error)
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
    this.subParentService.getAll()
                      .then(response => {
                        this.comboSucursalesProducto = response
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
    let sucursal = localStorage.getItem('currentSucursal')+''
    console.log(sucursal);

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
            console.log(this.productos);

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
    this.Total-= (e.cantidad*e.precioCosto)
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
