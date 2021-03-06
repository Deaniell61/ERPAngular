import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

import { path } from "../../../config.module";

import "rxjs/add/operator/toPromise";

@Injectable()
export class InventarioService {

 	headers = new Headers({'Access-Control-Allow-Origin':'*',
   'cache-control':'no-cache',
   'server':'Apache/2.4.18 (Ubuntu)',
   'x-ratelimit-limit':'60',
   'x-ratelimit-remaining':'59'})
 private basePath:string = path.path

 constructor(private http:Http){

 }

 private handleError(error:any):Promise<any> {
 console.error("ha ocurrido un error")
 console.log(error)
 return Promise.reject(error.message || error)
 }

     getAll():Promise<any> {
     let url = `${this.basePath}/api/inventario`
       return this.http.get(url)
                       .toPromise()
                         .then(response => {
                           //console.log(response.json())
                           return response.json()
                         })
                         .catch(this.handleError)
     }

     getAllAdmin():Promise<any> {
      let url = `${this.basePath}/api/admin/inventario`
        return this.http.get(url)
                        .toPromise()
                          .then(response => {
                            //console.log(response.json())
                            return response.json()
                          })
                          .catch(this.handleError)
      }


      getAllFilter(data):Promise<any> {
      let filter = data.filter?"?filter="+data.filter:"";
      let url = `${this.basePath}/api/filter/${data.id}/inventario/${data.state}${filter}`
        return this.http.get(url,{headers: this.headers})
                        .toPromise()
                          .then(response => {
                            //console.log(response)
                            return response.json()
                          })
                          .catch(this.handleError)
      }

     create(form):Promise<any> {
     let url = `${this.basePath}/api/inventario`
       return this.http.post(url,form)
                       .toPromise()
                         .then(response => {
                           //console.log(response.json())
                           return response.json()
                         })
                         .catch(this.handleError)
     }

     delete(id):Promise<any> {
     let url = `${this.basePath}/api/inventario/${id}`
       return this.http.delete(url)
                       .toPromise()
                         .then(response => {
                           //console.log(response.json())
                           return response.json()
                         })
                         .catch(this.handleError)
     }

     update(form):Promise<any> {
     let url = `${this.basePath}/api/inventario/${form.id}`
       return this.http.put(url,form)
                       .toPromise()
                         .then(response => {
                           //console.log(response.json())
                           return response.json()
                         })
                         .catch(this.handleError)
     }

     getSingle(id:number):Promise<any> {
     let url = `${this.basePath}/api/inventario/${id}`
       return this.http.get(url)
                       .toPromise()
                         .then(response => {
                           //console.log(response.json())
                           return response.json()
                         })
                         .catch(this.handleError)
     }

}
