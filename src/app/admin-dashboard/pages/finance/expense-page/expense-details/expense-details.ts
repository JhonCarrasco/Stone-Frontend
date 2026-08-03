import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'expense-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './expense-details.html',
})
export class ExpenseDetails {
  objInput = input.required<any>();
  router = inject(Router);
  fb = inject(FormBuilder);
  // financeService = inject(FinanceService);
  wasSaved = signal(false);
}
