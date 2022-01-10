import { Pipe, PipeTransform } from '@angular/core';
import { Bill } from '../model/bill';

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  transform(value: Array<Bill>, ...args: unknown[]): Array<Bill> {
    console.log('liczba parametrow : ' + args.length);
    console.log(args[0]);
    console.log(args[1]);

    return value.sort((a, b) => {
      let da = a.id ? a.id : '';
      let db = b.id ? b.id : '';
      //0 - id, 1-category,2-invoiceNumber,3-dateOfIssue, 4-dateOfPayment, 5-amount, 6-duedate
      switch (args[1]) {
        case 0:
          da = a.id ? a.id : '';
          db = b.id ? b.id : '';
          break;
        case 1:
          da = a.category?.name ? a.category.name : '';
          db = b.category?.name ? b.category.name : '';
          break;
        case 2:
          da = a.invoiceNumber ? a.invoiceNumber : '';
          db = b.invoiceNumber ? b.invoiceNumber : '';
          break;
        case 3:
          da = a.dateOfIssue ? a.dateOfIssue : '';
          db = b.dateOfIssue ? b.dateOfIssue : '';
          break;
        case 4:
          da = a.dateOfPayment ? a.dateOfPayment : '';
          db = b.dateOfPayment ? b.dateOfPayment : '';
          break;
        case 5:
          da = a.amount ? a.amount : '';
          db = b.amount ? b.amount : '';
          break;
        case 6:
          da = a.dueDate ? a.dueDate : '';
          db = b.dueDate ? b.dueDate : '';
          break;
      }

      if (args[0]) {
        if (da > db) {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (da < db) {
          return 1;
        } else {
          return -1;
        }
      }
    });
  }
}
