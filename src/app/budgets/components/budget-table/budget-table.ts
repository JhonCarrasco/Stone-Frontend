import { DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Budget } from '@shared/models/budget.model';
import { getStateDescription, statesBudget } from 'src/app/constant/budgetData';

@Component({
  selector: 'budget-table',
  imports: [RouterLink, DatePipe],
  templateUrl: './budget-table.html',
})
export class BudgetTable {
  budgets = input.required<Budget[]>();
  statesBudget = signal(statesBudget);

  onStateDescription(state: number | null): string {
    return getStateDescription(state);
  }
}
