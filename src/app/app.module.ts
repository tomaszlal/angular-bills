import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';//aby zastosować ngModel
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListbillsComponent } from './listbills/listbills.component';
import { AddbillComponent } from './addbill/addbill.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { HttpService } from './service/http.service';
import { HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    ListbillsComponent,
    AddbillComponent,
    AddcategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,   //aby zastosować ngModel - two way binding
    HttpClientModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
