import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //aby zastosować ngModel
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListbillsComponent } from './listbills/listbills.component';
import { AddbillComponent } from './addbill/addbill.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { HttpService } from './service/http.service';
import { HttpClientModule } from '@angular/common/http';
import localePL from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { SortDateAscPipe } from './shared/sort-date-asc.pipe';
import { SortByPipe } from './shared/sort-by.pipe';
// powyżej i niżej ustawienie lokalizacji
registerLocaleData(localePL);

@NgModule({
  declarations: [
    AppComponent,
    ListbillsComponent,
    AddbillComponent,
    AddcategoryComponent,
    SortDateAscPipe,
    SortByPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, //aby zastosować ngModel - two way binding
    ReactiveFormsModule,  // Reaktywne formularze - FormControl FormGroup, Validators
    HttpClientModule,
  ],
  providers: [
    HttpService,
    { provide: LOCALE_ID, useValue: 'pl' }],//lokalizacja  ustawienie
  bootstrap: [AppComponent],
})
export class AppModule {}
