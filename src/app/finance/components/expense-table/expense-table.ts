import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Expense } from '@shared/models/expense.model';
import { getExpenseTypeDescription } from 'src/app/constant/financeData';

@Component({
  selector: 'expense-table',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './expense-table.html',
})
export class ExpenseTable {
  expenses = input.required<Expense[]>();

  expenseTypeDescription(id: number | null) {
    return id !== null && id !== 0
      ? getExpenseTypeDescription(id)
      : 'Indeterminado';
  }
}
