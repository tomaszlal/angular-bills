import { Bill } from './../model/bill';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getCategory() : Observable <Array<Category>>{
    return this.http.get<Array<Category>>('http://192.168.0.210:8080/category');
  }

  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>('http://192.168.0.210:8080/category/'+id);
  }

  addCategory(category: Category): Observable<Category>{
    return this.http.post<Category>('http://192.168.0.210:8080/categories',category);
  }

  deleteCategoryById(id: number): Observable<boolean>{
    return this.http.delete<boolean>(`http://192.168.0.210:8080/category/${id}`);
  }

  checkAccountNumber(accNum: string) : Observable<boolean>{
    return this.http.get<boolean>('http://192.168.0.210:8080/accountcheck/'+accNum);
  }

  addBill(bill: Bill): Observable<number> {
    return this.http.post<number>('http://192.168.0.210:8080/bills',bill);
  }

  getBills(): Observable<Array<Bill>>{
    return this.http.get<Array<Bill>>('http://192.168.0.210:8080/bill');
  }

  getBillById(id: number): Observable<Bill>{
    return this.http.get<Bill>('http://192.168.0.210:8080/bill/'+id);
  }

  deleteBillById(id: number): Observable<void>{
    return this.http.delete<void>('http://192.168.0.210:8080/bill/'+id);
}
}
