import { Category } from './category';
export interface Bill{
  id?: number,
  category?: Category,
  invoiceNumber?: string,
  amount?: number,
  dateOfIssue?: string,
  dueDate?: string,
  dateOfPayment?: string,
  wasPaid?: boolean
}
