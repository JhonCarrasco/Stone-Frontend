import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ExpenseDetails } from './expense-details/expense-details';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'expense-page',
  imports: [ExpenseDetails],
  templateUrl: './expense-page.html',
})
export class ExpensePage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  financeService = inject(FinanceService);

  id = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])));

  expensesResource = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request }) => {
      return this.financeService.getFinanceById(
        request.id,
        'finances/expenses',
      );
    },
  });

  redirectEffect = effect(() => {
    if (this.expensesResource.error()) {
      this.router.navigate(['/admin/finances/expenses']);
    }
  });
}
