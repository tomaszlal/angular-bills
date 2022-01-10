import { Category } from './../model/category';
import { HttpService } from './../service/http.service';
import { Component, OnInit } from '@angular/core';
import { Bill } from '../model/bill';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-listbills',
  templateUrl: './listbills.component.html',
  styleUrls: ['./listbills.component.css'],
})
export class ListbillsComponent implements OnInit {
  listBills: Array<Bill> = new Array<Bill>();
  listCategories: Array<Category> = new Array<Category>();

  idBillInContext: number = 0; //numer rachunku do kontekstu
  billInContext: Bill = {}; //rachunek w kontekscie


  // formularz do edycji całego rachunku
  formToEdit: FormGroup = new FormGroup({
    category: new FormControl(this.listCategories, Validators.required),
    invoice: new FormControl('',[Validators.required, Validators.minLength(6)]),
    amount: new FormControl('',[
      Validators.required,
      Validators.pattern(/^\d{0,10}(\.\d{1,2})?$/),
    ]),
    dateOfIssue: new FormControl('',Validators.required),
    dateOfPayment: new FormControl('',Validators.required),
    dueDate: new FormControl('',Validators.required),
    wasPaid: new FormControl(''),
  });

  // formularz do okienka zapłaty
  public formToPay: FormGroup = new FormGroup({
    fieldDueDate: new FormControl('', Validators.required),
  });

  //filtry  -zmienne
  formFiltr: FormGroup = new FormGroup({
    category: new FormControl(this.listCategories)
  })
  notPaid: boolean = false;
  numberOfFiltCat?: number;
  allCategories: boolean = true;

  ascending = true;  //ascending czy mak=lejaco
  headColumnNr = 0;  //0 sortuj po id,iaczej 2 to druga kolumna tabeli..

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getCategory();
    this.getBills();
  }

  //ustawienie do kontekstu rachunku który ma być usunięty
  public setIdBillToDel(item: Bill) {
    console.log(item);
    this.idBillInContext = item.id ? item.id : 0;
    this.httpService.getBillById(this.idBillInContext).subscribe((bill) => {
      this.billInContext = bill;
    });
  }

  //ustawienie id rachunku do kontekstu
  public setBillToInContext(bill: Bill) {
    this.billInContext = bill;
  }

  //przygotowanie - wypełnienie formularza danymi z rachynku z kontekstu
  public setBillToEdit(bill: Bill) {
    this.setBillToInContext(bill);
    this.formToEdit.controls.category.setValue(this.billInContext.category);
    this.formToEdit.controls.invoice.setValue(this.billInContext.invoiceNumber);
    this.formToEdit.controls.amount.setValue(this.billInContext.amount);
    this.formToEdit.controls.dateOfIssue.setValue(
      this.billInContext.dateOfIssue
    );
    this.formToEdit.controls.dateOfPayment.setValue(
      this.billInContext.dateOfPayment
    );
    this.formToEdit.controls.dueDate.setValue(this.billInContext.dueDate);
    this.formToEdit.controls.wasPaid.setValue(this.billInContext.wasPaid);
    if (this.billInContext.wasPaid) {
      this.formToEdit.controls.dueDate.enable(); // włączenie wyłączenie pola
      this.formToEdit.controls.wasPaid.enable();
    } else {
      this.formToEdit.controls.dueDate.disable();
      this.formToEdit.controls.wasPaid.disable();
    }
  }

  //subskrybcja categorii z Api do listy kategorii
  public getCategory() {
    this.httpService.getCategory().subscribe((categories) => {
      categories.forEach((category) => {
        this.listCategories.push(category);
      });

    });
  }

  //subskrybcja rachunków z api do listy katagorii
  public getBills() {
    this.httpService.getBills().subscribe((bills) => {
      bills.forEach((bill) => {
        this.listBills.push(bill);
      });
      this.listBills = this.listBills.slice(); //można dać PIPE-a z Pure:False
      //nie obciąza systemu ciągłym sortowaniem
    });
  }

  public clearListOfBills() {
    const counterBills = this.listBills.length;
    for (let i = 0; i < counterBills; i++) {
      this.listBills.pop();
    }
  }

  //wyłączenie pól form po odkliknieciu Zapłacone
  public changeInPaid() {
    this.formToEdit.controls.dueDate.disable();
    this.formToEdit.controls.wasPaid.disable();
    this.formToEdit.controls.dueDate.reset();
  }

  // usuniecie z Api rachunku
  public delBillFromDb() {
    this.httpService.deleteBillById(this.idBillInContext).subscribe(() => {
      this.clearListOfBills();
      this.getBills();
    });
  }

  //wykonanie polecenia zapłać - wprowadzenie daty z formularza do rachunku w kontekscie i czy zapłacone
  public updateBillInDb() {
    // console.log(this.billInContext);
    this.billInContext.dueDate = this.formToPay.controls.fieldDueDate.value;
    this.billInContext.wasPaid = true;
    // console.log(this.billInContext);
    // console.log(this.listBills);
    this.httpService.updateBill(this.billInContext).subscribe((bill) => {
      console.log(bill);
    });
    this.formToPay.reset();
  }

  //zapisanie po edycji całego rachunku
  public saveBillToDb() {
    // console.log(this.formToEdit.value);
    this.billInContext.category = this.formToEdit.controls.category.value;
    this.billInContext.invoiceNumber = this.formToEdit.controls.invoice.value;
    this.billInContext.amount = this.formToEdit.controls.amount.value;
    this.billInContext.dateOfIssue = this.formToEdit.controls.dateOfIssue.value;
    this.billInContext.dateOfPayment = this.formToEdit.controls.dateOfPayment.value;
    if (this.formToEdit.value.wasPaid) {
      // kiedy nie odkliknieto checkboxa Zapłacone
      this.billInContext.dueDate = this.formToEdit.controls.dueDate.value;
      this.billInContext.wasPaid = this.formToEdit.controls.wasPaid.value;
    } else {
      // kiedy odkliknieto checkboxa Zapłacone
      this.billInContext.dueDate = '';
      this.billInContext.wasPaid = false;
    }
    // console.log(this.billInContext);
    this.httpService.updateBill(this.billInContext).subscribe((bill) => {
      console.log(bill);
    });
    this.formToEdit.reset();
  }


  //filtry

  selectCategory() {
    console.log(this.formFiltr.controls.category.value);
    if (this.formFiltr.controls.category.value == null){
      this.allCategories=true;
    }else {
      this.allCategories = false;
      this.numberOfFiltCat=this.formFiltr.controls.category.value.id;
    }

  }

  onlyNotPaid() {

    this.notPaid = !this.notPaid;

  }

  // sortowania
  sortCategoryAsc() {
    this.ascending = true;
    this.headColumnNr = 1;

  }
  sortCategoryDesc() {
    this.ascending = false;
    this.headColumnNr = 1;
  }
  sortInvoiceAsc() {
    this.ascending = true;
    this.headColumnNr = 2;
  }
  sortInvoiceDesc() {
    this.ascending = false;
    this.headColumnNr = 2;
  }
  sortDateOfIssueAsc() {
    this.ascending = true;
    this.headColumnNr = 3;
  }
  sortDateOfIssueDesc() {
    this.ascending = false;
    this.headColumnNr = 3;
  }
  sortDateOfPaymentAsc() {
    this.ascending = true;
    this.headColumnNr = 4;
  }
  sortDateOfPaymentDesc() {
    this.ascending = false;
    this.headColumnNr = 4;
  }
  sortAmountAsc() {
    this.ascending = true;
    this.headColumnNr = 5;
  }
  sortAmountDesc() {
    this.ascending = false;
    this.headColumnNr = 5;
  }
  sortDueDateAsc() {
    this.ascending = true;
    this.headColumnNr = 6;
  }
  sortDueDateDesc() {
    this.ascending = false;
    this.headColumnNr = 6;
  }






  //get
  get getWasPaidField() {
    return this.formToEdit.get('wasPaid');
  }
}
