import { Category } from './../model/category';
import { HttpService } from './../service/http.service';
import { Component, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css'],
})
export class AddcategoryComponent implements OnInit {
  categoryName = ''; // two way data binding z polem nazwa kategorii
  isCorrectlyFieldCategory = false; //czy prawidłowa wartość pola

  accountNumber = '';
  isCorrectlyFieldAccountNumber = false;

  recipient = '';
  isCorrectlyFieldRecipient = false;

  disableButAddCat = true; //włączenie przycisku dodaj kategorię

  categoryList = Array<Category>(); //lista kategorii wyświetlanych na stronie

  idCatToDelete: number = 0;
  categoryToModal?: Category;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getCategory();
    console.log(this.categoryList);
  }

  public nameCategoryFieldUpdate() {
    if (this.categoryName.length > 3) {
      this.isCorrectlyFieldCategory = true;
    } else {
      this.isCorrectlyFieldCategory = false;
    }
    this.validateFormFields();
  }

  public accounFieldUpdate(newValue: string) {
    // polaczenie z api i sprawdzenie nr konta
    this.accountNumber = this.accountNumber.replace(/\D+/, '');

    console.log(this.accountNumber);
    if (this.accountNumber.length == 26) {
      this.httpService
        .checkAccountNumber(this.accountNumber)
        .subscribe((accIsCorect) => {
          console.log(accIsCorect);
          this.isCorrectlyFieldAccountNumber = accIsCorect;
          this.validateFormFields();
        });
    } else {
      this.isCorrectlyFieldAccountNumber = false;
      this.validateFormFields();
    }
  }

  public recipientCategoryFieldUpdate() {
    if (this.recipient.length > 5) {
      this.isCorrectlyFieldRecipient = true;
    } else {
      this.isCorrectlyFieldRecipient = false;
    }
    this.validateFormFields();
  }

  private validateFormFields() {
    if (
      this.isCorrectlyFieldCategory &&
      this.isCorrectlyFieldAccountNumber &&
      this.isCorrectlyFieldRecipient
    ) {
      this.disableButAddCat = false;
    } else {
      this.disableButAddCat = true;
    }
  }

  public saveCategoryToDb() {
    const category: Category = {
      name: this.categoryName,
      accountNumber: this.accountNumber,
      recipient: this.recipient,
    };

    this.httpService.addCategory(category).subscribe((category) => {
      console.log(category);
      this.categoryList.push(category);
    });

    this.categoryName = '';
    this.accountNumber = '';
    this.recipient = '';
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
        alert("Błąd podaczas usuwania - kategoria używana w rachunkach");
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
}
