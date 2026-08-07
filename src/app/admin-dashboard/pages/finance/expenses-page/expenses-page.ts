import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchExpense } from '@shared/components/search-expense/search-expense';
import { ExpenseTable } from 'src/app/finance/components/expense-table/expense-table';
import { FinanceService } from 'src/app/services/finance.service';

const uriService = 'finances/expenses';
@Component({
  selector: 'expenses-page',
  imports: [PaginationComponent, RouterLink, ExpenseTable, SearchExpense],
  templateUrl: './expenses-page.html',
})
export class ExpensesPage {
  financeService = inject(FinanceService);
  paginationService = inject(PaginationService);
  activatedRoute = inject(ActivatedRoute);
  elementsPerPage = signal(10);
  searchText = signal('');

  // expensesResource = signal({
  //   data: [
  //     {
  //       id: 1,
  //       fecha: '2023-06-01',
  //       tipo: 'Petroleo',
  //       value: 1000,
  //       description: 'Gasto de petroleo',
  //     },
  //   ],
  //   pages: 1,
  // });

  expensesResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.elementsPerPage(),
      searchText: this.searchText(),
      uri: uriService,
    }),
    loader: ({ request }) => {
      return this.financeService.getFinances({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
        uri: request.uri,
      });
    },
  });

  onSearchExpenseChange(event: string) {
    this.searchText.set(event);
    const itemData$ = this.financeService.getFinances({
      offset:
        (this.paginationService.currentPage() - 1) * this.elementsPerPage(),
      limit: this.elementsPerPage(),
      searchText: event,
      uri: uriService,
    });

    itemData$.subscribe((response) => {
      this.expensesResource.set(response);
      // console.log('onSearchExpenseChange', response);
      // this.searchText.set('');
    });
  }
}
