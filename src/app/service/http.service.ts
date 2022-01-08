import { Bill } from './../model/bill';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // apiUrl:string = 'http://' + location.hostname + ':8080';
  apiUrl: string = 'http://192.168.0.210:8080'; // w domu
  // apiUrl:string = 'http://192.168.192.210:8080'; // poza domem

  constructor(private http: HttpClient) {}

  getCategory(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>(this.apiUrl + '/category');
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(this.apiUrl + '/category/' + id);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl + '/categories', category);
  }

  deleteCategoryById(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrl + '/category/' + id);
  }

  checkAccountNumber(accNum: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + '/accountcheck/' + accNum);
  }

  addBill(bill: Bill): Observable<number> {
    return this.http.post<number>(this.apiUrl + '/bills', bill);
  }

  getBills(): Observable<Array<Bill>> {
    return this.http.get<Array<Bill>>(this.apiUrl + '/bill');
  }

  getBillById(id: number): Observable<Bill> {
    return this.http.get<Bill>(this.apiUrl + '/bill/' + id);
  }

  deleteBillById(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/bill/' + id);
  }

  updateBill(bill: Bill) : Observable<Bill> {
    return this.http.put<Bill>(this.apiUrl+'/bills',bill);
  }
}
