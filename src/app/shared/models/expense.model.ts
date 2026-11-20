import { FileDrive } from './fileDrive.model';

export interface Expense {
  id?: number;
  active?: null;
  createAt?: null;
  updatedAt?: null;
  documentType: number;
  expenseTypeId: number | null;
  expenseDate: Date | null;
  employee: string | null;
  project: string | null;
  budgetId: number | null;
  files?: FileDrive[] | null;
  amount: number | null;
  methodPaymentId: number | null;
  paymentReceiptId: number | null;
  billNumber: number | null;

  description: string | null;

  vehicle: string | null;
  registration: string | null;

  location: string | null;
}
