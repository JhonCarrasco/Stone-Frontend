import { Component, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchExpense } from '@shared/components/search-expense/search-expense';
import { ExpenseTable } from 'src/app/finance/components/expense-table/expense-table';

@Component({
  selector: 'expenses-page',
  imports: [PaginationComponent, RouterLink, ExpenseTable, SearchExpense],
  templateUrl: './expenses-page.html',
})
export class ExpensesPage {
  // financeService = inject(FinanceService);
  paginationService = inject(PaginationService);
  activatedRoute = inject(ActivatedRoute);
  elementsPerPage = signal(10);
  searchText = signal('');

  expensesResource = signal({
    data: [
      {
        id: 1,
        fecha: '2023-06-01',
        tipo: 'Petroleo',
        value: 1000,
        description: 'Gasto de petroleo',
      },
    ],
    pages: 1,
  });

  onSearchExpenseChange(event: string) {
    throw new Error('Method not implemented.');
  }
}
