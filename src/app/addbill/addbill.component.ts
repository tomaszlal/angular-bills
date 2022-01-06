import { Bill } from './../model/bill';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Category } from '../model/category';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-addbill',
  templateUrl: './addbill.component.html',
  styleUrls: ['./addbill.component.css'],
})
export class AddbillComponent implements OnInit {

  amountField: string = '';

  categoryList = Array<Category>(); //lista kategorii wyświetlanych polu wyboru

  formBill: FormGroup = new FormGroup({
    category: new FormControl(this.categoryList, Validators.required),
    invoice: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{0,10}(\.\d{1,2})?$/),
    ]),
    dateOfIssue: new FormControl('', Validators.required),
    dateOfPayment: new FormControl('', Validators.required)
  });


  constructor(private httpService: HttpService) {}

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

  public changeAmount() {
    let amount = this.formBill.controls.amount.value;
    amount = amount.replace(/,/g, '.');
    this.amountField = amount;
  }

  public onlyNumber(event: KeyboardEvent): boolean {
    let charCode = event.key;
    //zamiana znaku wprowdzonego z klawiatury zamiast przecinka to kropka
    if (charCode == ',') charCode = '.';
    //jezeli jes już jedna kropka w kwocie to nie wstawiaj znaku
    if (this.formBill.controls.amount.value.includes('.') && charCode == '.')
      return false;
    // wstawiaj tylko i wylacznie znaki 0-9 i kropke oraz reaguj na znaki sterujace
    if (
      (charCode.charCodeAt(0) > 47 && charCode.charCodeAt(0) < 58) ||
      charCode.charCodeAt(0) < 32 ||
      charCode.charCodeAt(0) == 46
    ) {
      // jesli w kwocie wystepuje sekwencja '.xx' i nie jest nulem to nie wstawiaj kolejnego znaku
      // if (this.formBill.controls.amount.value.match(/\.[0-9][0-9]?/g) != null) {
      //   if (
      //     this.formBill.controls.amount.value.match(/\.[0-9][0-9]?/g)[0]
      //       .length == 3
      //   )
      //     return false;
      // }
      return true;
    } else {
      return false;
    }
  }



  saveBillInDb() {
    console.log(this.formBill.controls.category.value.id);
    console.log(this.formBill.controls.invoice.value);
    console.log(this.formBill);

    const bill: Bill={
      invoiceNumber: this.formBill.controls.invoice.value,
      category: {
        id: this.formBill.controls.category.value.id
      },
      amount: this.formBill.controls.amount.value,
      dateOfIssue: this.formBill.controls.dateOfIssue.value,
      dateOfPayment: this.formBill.controls.dateOfPayment.value,
      wasPaid: false

    };
    console.log(bill);

    this.httpService.addBill(bill).subscribe((bilId) =>{
      console.log(bilId);
    });

  }

  // gettery do pol
  get getCategoryField() {
    return this.formBill.get("category");
  }
  get getAmountField() {
    return this.formBill.get("amount");
  }
  get getInvoiceField() {
    return this.formBill.get("invoice");
  }
  get getDateOfIssueField() {
    return this.formBill.get("dateOfIssue");
  }
  get getDateOfPaymentField() {
    return this.formBill.get("dateOfPayment");
  }


}
