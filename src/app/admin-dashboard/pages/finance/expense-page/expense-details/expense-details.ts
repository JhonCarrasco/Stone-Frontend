import { Component, inject, input, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarDatepicker } from '@shared/components/calendar-datepicker/calendar-datepicker';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { SearchBudget } from '@shared/components/search-budget/search-budget';
import {
  expenseType,
  methodPayment,
  paymentReceipt,
} from 'src/app/constant/financeData';
import { BudgetService } from 'src/app/services/budgetService';
import { Expense } from '../../../../../shared/models/expense.model';
import { FinanceService } from 'src/app/services/finance.service';
import { firstValueFrom } from 'rxjs';
import { InputFile } from '@shared/components/input-file/input-file';
import { DriveService } from 'src/app/services/driveService';
import { FileDrive } from '@shared/models/fileDrive.model';

@Component({
  selector: 'expense-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    CalendarDatepicker,
    SearchBudget,
    InputFile,
  ],
  templateUrl: './expense-details.html',
})
export class ExpenseDetails implements OnInit {
  objInput = input.required<Expense>();
  router = inject(Router);
  fb = inject(FormBuilder);
  financeService = inject(FinanceService);
  budgetService = inject(BudgetService);
  driveService = inject(DriveService);
  wasSaved = signal(false);
  searchBudgetText = signal('');
  expenseType = signal(expenseType);
  methodPayment = signal(methodPayment);
  paymentReceipt = signal(paymentReceipt);
  fileList: File[] | undefined = undefined;

  form = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    expenseTypeId: [null as number | null],
    expenseDate: [null as Date | null],
    employee: [null as any],
    project: [null as any],
    budgetId: [null as number | null],
    amount: [null as number | null],
    methodPaymentId: [null as number | null],
    paymentReceiptId: [null as number | null],
    billNumber: [null as number | null],
    files: [[] as (File | FileDrive)[]],
    documentType: [0],
    description: [null as string | null],

    vehicle: [null as string | null],
    registration: [null as string | null],

    location: [null as string | null],
  });

  budgetsResource = rxResource({
    request: () => ({
      page: 0,
      limit: 100,
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

  onRemoveFileEvent(fileName: string) {
    // get file from objInput().files by name
    const fileToRemove = this.objInput().files?.find(
      (file) => file.fileName === fileName,
    );

    if (fileToRemove && fileToRemove.folderParentId && fileToRemove.fileId) {
      this.driveService.deleteFilesByFileId(fileToRemove.fileId).subscribe();
    }
  }

  onFilesEvent(event: File[]) {
    this.fileList = event;
  }

  onSelectedChange(event: Event) {
    const { name, value } = event.target as HTMLSelectElement;
    const selectedValue = Number(value) ?? null;

    this.form.patchValue({
      [name]: selectedValue,
    });

    if (name === 'expenseTypeId') {
      this.objInput().expenseTypeId = selectedValue;
    }
  }

  onExpenseDateChange(event: Date) {
    this.form.patchValue({
      expenseDate: event,
    });
  }
  onInputChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.form.patchValue({ [name]: value });
  }

  onSearchBudgetChange(event: string) {
    this.searchBudgetText.set(event);
    const searchSplit = event.split(' - ');
    const findText = searchSplit.length > 1 ? searchSplit[1] : searchSplit[0];
    const productData$ = this.budgetService.getBudgets({
      offset: 0,
      limit: 100,
      searchText: findText,
    });

    productData$.subscribe((response) => {
      this.budgetsResource.set(response);
      if (response.data.length === 1) {
        const item = response.data.find(
          (elem) => elem.projectName === findText,
        );
        this.form.patchValue({
          project: item?.projectName,
          budgetId: item?.id,
        });
      }
    });
  }

  setFormValue(formLike: Partial<Expense>) {
    this.form.reset({ ...this.objInput(), files: [] } as Expense);
    const { expenseDate } = this.objInput();
    const currentDate = expenseDate! ?? new Date();
    formLike = {
      ...formLike,
      expenseDate: currentDate,
      documentType: 9, // default to RENDICIÓN DE GASTOS
    } as Partial<Expense>;

    this.objInput().expenseDate = currentDate;

    this.form.patchValue(formLike as any);

    this.fileList = this.objInput().files?.map((file) => {
      const blob = new Blob([file.fileId], { type: file.contentType });
      return new File([blob], file.fileName, { type: file.contentType });
    }) as File[];
  }

  ngOnInit() {
    this.setFormValue(this.objInput());
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value;

    const objLike: Partial<Expense> = {
      ...(formValue as Expense),
      expenseTypeId: Number(formValue.expenseTypeId),
      methodPaymentId: Number(formValue.methodPaymentId),
      paymentReceiptId: Number(formValue.paymentReceiptId),
      budgetId: Number(formValue.budgetId),
    } as Partial<Expense>;

    if (this.objInput().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.financeService.createFinance(
          objLike,
          'finances/expenses',
          this.fileList,
        ),
      );

      this.router.navigate(['/admin/finances/expenses', response.data]);
    } else {
      const expenseId = this.objInput().id?.toString();
      if (!expenseId) return;

      const response = await firstValueFrom(
        this.financeService.updateFinance(
          expenseId,
          objLike,
          'finances/expenses',
          this.fileList,
        ),
      );

      this.objInput().files = [
        ...(this.objInput().files ?? []),
        ...response.data,
      ];

      this.form.patchValue({
        files: [...(this.form.value.files ?? []), ...response.data],
      });
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
