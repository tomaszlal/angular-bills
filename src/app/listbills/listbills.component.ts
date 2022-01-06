import { Category } from './../model/category';
import { HttpService } from './../service/http.service';
import { Component, OnInit } from '@angular/core';
import { Bill } from '../model/bill';

@Component({
  selector: 'app-listbills',
  templateUrl: './listbills.component.html',
  styleUrls: ['./listbills.component.css']
})
export class ListbillsComponent implements OnInit {

  listBills: Array<Bill> = new Array<Bill>();
  listCategories: Array<Category> = new Array<Category>();

  idBillToDelete: number = 0;
  billInContext?: Bill;

  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.getCategory();
    this.getBills();


  }

  public setIdBillToDel(item : Bill){
    console.log(item);
    this.idBillToDelete = item.id ? item.id : 0;
    this.httpService.getBillById(this.idBillToDelete).subscribe((bill) =>{
      this.billInContext = bill;
    });

  }


  public getCategory() {
    this.httpService.getCategory().subscribe((categories) => {
      categories.forEach((category) => {
        this.listCategories.push(category);
      });
    });
  }

  public getBills(){
    this.httpService.getBills().subscribe((bills) =>{
      bills.forEach((bill) =>{
        this.listBills.push(bill);
      })
    });
  }

  public clearListOfBills(){
    const counterBills = this.listBills.length;
    for (let i = 0; i < counterBills; i++) {
      this.listBills.pop();

    }
  }

  public delBillFromDb(){
    this.httpService.deleteBillById(this.idBillToDelete).subscribe((v) => {
      this.clearListOfBills();
      this.getBills();
    });


  }
}
