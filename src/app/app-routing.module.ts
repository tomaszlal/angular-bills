import { AddcategoryComponent } from './addcategory/addcategory.component';
import { ListbillsComponent } from './listbills/listbills.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddbillComponent } from './addbill/addbill.component';

const routes: Routes = [
  
  { path: '', component: ListbillsComponent },
  { path: 'addbill', component: AddbillComponent },
  { path: 'addcategory', component: AddcategoryComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
