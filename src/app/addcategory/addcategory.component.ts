import { Observable } from 'rxjs';
import { Category } from './../model/category';
import { HttpService } from './../service/http.service';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css'],
})
export class AddcategoryComponent implements OnInit {
  public categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    accountNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{26}?$/),
    ]),
    recipient: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  isCorrectlyFieldAccountNumber = false;

  categoryList = Array<Category>(); //lista kategorii wyświetlanych na stronie

  idCatToDelete: number = 0;
  categoryToModal?: Category;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getCategory();
    console.log(this.categoryList);
  }

  public onlyNumber(event: KeyboardEvent): boolean {
    let charCode = event.key;
    // wstawiaj tylko i wylacznie znaki 0-9  oraz reaguj na znaki sterujace
    if (
      (charCode.charCodeAt(0) > 47 && charCode.charCodeAt(0) < 58) ||
      charCode.charCodeAt(0) < 32
    ) {
      return true;
    } else {
      return false;
    }
  }

  public accounFieldUpdate() {
    // polaczenie z api i sprawdzenie nr konta
    const accNumb = this.categoryForm.controls.accountNumber.value;
    // console.log(accNumb);
    if (accNumb.length == 26) {
      this.httpService.checkAccountNumber(accNumb).subscribe((accIsCorect) => {
        this.isCorrectlyFieldAccountNumber = accIsCorect;
        // console.log(this.isCorrectlyFieldAccountNumber);
      });
    } else {
      this.isCorrectlyFieldAccountNumber = false;
      // console.log(this.isCorrectlyFieldAccountNumber);
    }
  }

  public saveCategoryToDb() {
    const category: Category = {
      name: this.categoryForm.controls.categoryName.value,
      accountNumber: this.categoryForm.controls.accountNumber.value,
      recipient: this.categoryForm.controls.recipient.value,
    };

    this.httpService.addCategory(category).subscribe((category) => {
      console.log(category);
      this.categoryList.push(category);
    });
  }

  public getCategoryById(id: number) {
    this.httpService.getCategoryById(id).subscribe((category) => {
      this.categoryToModal = category;
    });
  }

  public getCategory() {
    this.httpService.getCategory().subscribe((categories) => {
      categories.forEach((category) => {
        this.categoryList.push(category);
      });
    });
  }

  public deleteCategoryById(id: number) {
    this.httpService.deleteCategoryById(id).subscribe((isDeleted) => {
      console.log(isDeleted);
      if (isDeleted) {
        this.clearListCategory();
        this.getCategory();
      } else {
        alert('Błąd podaczas usuwania - kategoria używana w rachunkach');
      }
    });
  }

  public idCatToDel(item: Category) {
    console.log(item.id);
    this.idCatToDelete = item.id ? item.id : 0;
    this.getCategoryById(this.idCatToDelete);
  }

  public delCategoryFromDb() {
    console.log('kasujemy');
    this.deleteCategoryById(this.idCatToDelete);
  }

  public clearListCategory() {
    const numberOfElem = this.categoryList.length;
    for (let i = 0; i < numberOfElem; i++) {
      this.categoryList.pop();
    }
  }

  //geters
  get nameCategory() {
    return this.categoryForm.get('categoryName');
  }

  get numberAccount() {
    return this.categoryForm.get('accountNumber');
  }

  get getRecipient() {
    return this.categoryForm.get('recipient');
  }
}
