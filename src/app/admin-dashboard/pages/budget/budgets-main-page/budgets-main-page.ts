import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchBudget } from '@shared/components/search-budget/search-budget';
import { BudgetTable } from 'src/app/budgets/components/budget-table/budget-table';
import { BudgetService } from 'src/app/services/budgetService';

@Component({
  selector: 'app-budgets-main-page',
  imports: [PaginationComponent, RouterLink, BudgetTable, SearchBudget],
  templateUrl: './budgets-main-page.html',
})
export class BudgetsMainPage {
  budgetService = inject(BudgetService);
  paginationService = inject(PaginationService);
  elementsPerPage = signal(10);
  searchBudgetText = signal('');

  budgetsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.elementsPerPage(),
      searchText: this.searchBudgetText(), //TODO: add search text signal and bind to input from html page
    }),
    loader: ({ request }) => {
      return this.budgetService.getBudgets({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
      });
    },
  });

  onSearchBudgetChange(event: string) {
    this.searchBudgetText.set(event);
    const productData$ = this.budgetService.getBudgets({
      offset:
        (this.paginationService.currentPage() - 1) * this.elementsPerPage(),
      limit: this.elementsPerPage(),
      searchText: event,
    });

    productData$.subscribe((response) => {
      this.budgetsResource.set(response);
      console.log('onSearchBudgetChange', response);
      // this.searchBudgetText.set('');
    });
  }
}
