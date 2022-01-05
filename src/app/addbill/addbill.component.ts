import { Component, OnInit } from '@angular/core';
import { Category } from '../model/category';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-addbill',
  templateUrl: './addbill.component.html',
  styleUrls: ['./addbill.component.css']
})
export class AddbillComponent implements OnInit {

  selectedCategory: number | undefined;
  invoiceField: string = '';
  amountField: string = '';


  isCorrectlyFieldAmount = false;
  isCorrectlyFieldCategory = false;
  isCorrectlyFieldInvoiceNumer = false;
  isCorrectlyFieldDateOfIssue = false;
  isCorrectlyFieldDateOfPayment = false;

  categoryList = Array<Category>(); //lista kategorii wyświetlanych polu wyboru
  oldAmount: string= '';

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getCategory();

  }

  public getCategory() {
    this.httpService.getCategory().subscribe((categories) => {
      categories.forEach((category) => {
        this.categoryList.push(category);
      });
    });
  }

  public validateCategoryField(event : number) {
    this.selectedCategory = event;
    // console.log(this.selectedCategory);
    this.isCorrectlyFieldCategory = true;
  }

  public validateInvoiceField(){
    if (this.invoiceField.length > 5){
      this.isCorrectlyFieldInvoiceNumer=true;
    } else {
      this.isCorrectlyFieldInvoiceNumer = false;
    }

  }

  public validateAmountField(amount: string){
    console.log(amount);
    //this.oldAmount = this.amountField;
    amount = amount.replace(/,/g, '.');
    amount = amount.replace(/[^0-9\\.]+/g, '');
    const tableOfAmount = amount.split('.');
    if (tableOfAmount.length == 1 || (tableOfAmount.length == 2 && tableOfAmount[1].length < 3 && tableOfAmount[1].length > 0)){
      this.isCorrectlyFieldAmount = true;
      this.amountField = amount;
      this.oldAmount = this.amountField;
    } else {
      this.amountField = this.oldAmount;
    }

    console.log(this.amountField);
  }
}
