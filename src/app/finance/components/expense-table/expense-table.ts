import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'expense-table',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './expense-table.html',
})
export class ExpenseTable {
  expenses = input.required<any[]>();
}
