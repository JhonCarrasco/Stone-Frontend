import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { BudgetService } from 'src/app/services/budgetService';
import { BudgetDetails } from './budget-details/budget-details';

@Component({
  selector: 'budget-main-page',
  imports: [BudgetDetails],
  templateUrl: './budget-main-page.html',
})
export class BudgetMainPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  budgetService = inject(BudgetService);

  budgetId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id'])),
  );

  budgetsResource = rxResource({
    request: () => ({ id: this.budgetId() }),
    loader: ({ request }) => {
      return this.budgetService.getBudgetById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.budgetsResource.error()) {
      this.router.navigate(['/admin/budgets']);
    }
  });
}
