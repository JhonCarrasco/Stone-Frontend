import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ExpenseDetails } from './expense-details/expense-details';

@Component({
  selector: 'expense-page',
  imports: [ExpenseDetails],
  templateUrl: './expense-page.html',
})
export class ExpensePage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  // financeService = inject(FinanceService);

  id = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])));

  // materialsResource = rxResource({
  //     request: () => ({ id: this.id() }),
  //     loader: ({ request }) => {
  //       return this.financeService.getExpenseById(
  //         request.id,
  //         'finances/expenses',
  //       );
  //     },
  //   });

  //   redirectEffect = effect(() => {
  //     if (this.materialsResource.error()) {
  //       this.router.navigate(['/admin/finances/expenses']);
  //     }
  //   });

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
}
