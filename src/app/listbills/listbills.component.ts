import { Category } from './../model/category';
import { HttpService } from './../service/http.service';
import { Component, OnInit } from '@angular/core';
import { Bill } from '../model/bill';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-listbills',
  templateUrl: './listbills.component.html',
  styleUrls: ['./listbills.component.css']
})
export class ListbillsComponent implements OnInit {

  listBills: Array<Bill> = new Array<Bill>();
  listCategories: Array<Category> = new Array<Category>();

  idBillInContext: number = 0;
  billInContext: Bill ={};

  formToEdit: FormGroup = new FormGroup({
    category: new FormControl(this.listCategories, Validators.required),
    invoice: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{0,10}(\.\d{1,2})?$/),
    ]),
    dateOfIssue: new FormControl('', Validators.required),
    dateOfPayment: new FormControl('', Validators.required),
    dueDate: new FormControl(''),
    wasPaid: new FormControl('')
  });


  public formToPay: FormGroup = new FormGroup({
    fieldDueDate: new FormControl('',Validators.required)
  });



  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.getCategory();
    this.getBills();


  }

  public setIdBillToDel(item : Bill){
    console.log(item);
    this.idBillInContext = item.id ? item.id : 0;
    this.httpService.getBillById(this.idBillInContext).subscribe((bill) =>{
      this.billInContext = bill;
    });

  }

  public setBillToInContext(bill : Bill){
    this.billInContext = bill;
  }

  public setBillToEdit(bill: Bill){
    this.setBillToInContext(bill);
    this.formToEdit.controls.category.setValue(this.billInContext.category);
    this.formToEdit.controls.invoice.setValue(this.billInContext.invoiceNumber);
    this.formToEdit.controls.amount.setValue(this.billInContext.amount);
    this.formToEdit.controls.dateOfIssue.setValue(this.billInContext.dateOfIssue);
    this.formToEdit.controls.dateOfPayment.setValue(this.billInContext.dateOfPayment);
    this.formToEdit.controls.dueDate.setValue(this.billInContext.dueDate);
    this.formToEdit.controls.wasPaid.setValue(this.billInContext.wasPaid);
    if (this.billInContext.wasPaid){

      this.formToEdit.controls.dueDate.enable(); // włączenie wyłączenie pola
      this.formToEdit.controls.wasPaid.enable();
    } else {

      this.formToEdit.controls.dueDate.disable();
      this.formToEdit.controls.wasPaid.disable();
    }
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

  public changeInPaid() {

    this.formToEdit.controls.dueDate.disable();
    this.formToEdit.controls.wasPaid.disable();
    this.formToEdit.controls.dueDate.reset();
  }

  public delBillFromDb(){
    this.httpService.deleteBillById(this.idBillInContext).subscribe((v) => {
      this.clearListOfBills();
      this.getBills();
    });
  }

  public updateBillInDb(){
    console.log(this.billInContext);
    this.billInContext.dueDate = this.formToPay.controls.fieldDueDate.value;
    this.billInContext.wasPaid = true;
    console.log(this.billInContext);
    console.log(this.listBills);
    this.httpService.updateBill(this.billInContext).subscribe((bill) => {
      console.log(bill);
    });
    this.formToPay.reset();
  }

  public saveBillToDb(){
    console.log(this.billInContext);
    console.log(this.formToEdit.value)

  }

  //get
  get getWasPaidField() {
    return this.formToEdit.get('wasPaid');
  }

}
