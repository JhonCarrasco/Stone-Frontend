import { Component, inject, input, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarDatepicker } from '@shared/components/calendar-datepicker/calendar-datepicker';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { SearchBudget } from '@shared/components/search-budget/search-budget';
import { Budget } from '@shared/models/budget.model';
import { Customer } from '@shared/models/customer.model';
import { Material, MaterialGuideGeneric } from '@shared/models/material.model';
import { Provider } from '@shared/models/provider.model';
import { firstValueFrom } from 'rxjs';
import {
  currencyTypeData,
  getCurrencyTypeDescription,
} from 'src/app/constant/currencyTypeData';
import {
  documentType,
  getDocumentTypeDescription,
} from 'src/app/constant/documentTypeData';
import { ItemizedMaterialTable } from 'src/app/materials/components/itemizedMaterial-table/itemizedMaterial-table';
import { BudgetService } from 'src/app/services/budgetService';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'voucher-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ItemizedMaterialTable,
    CalendarDatepicker,
    SearchBudget,
  ],
  templateUrl: './voucher-details.html',
})
export class VoucherDetails implements OnInit {
  objInput = input.required<MaterialGuideGeneric>();
  router = inject(Router);
  fb = inject(FormBuilder);
  materialService = inject(MaterialService);
  budgetService = inject(BudgetService);
  wasSaved = signal(false);
  searchBudgetText = signal('');

  onSearchBudgetChange(event: string) {
    this.searchBudgetText.set(event);
    const searchSplit = event.split(' - ');
    const findText = searchSplit.length > 1 ? searchSplit[1] : searchSplit[0];
    const productData$ = this.budgetService.getBudgets({
      offset: 0,
      limit: 100,
      searchText: findText,
    });

    // console.log('VoucherDetails.onSearchBudgetChange.EVENT', event);

    productData$.subscribe((response) => {
      this.budgetsResource.set(response);
      // console.log('VoucherDetails.onSearchBudgetChange.RESPONSE', response);
      if (response.data.length === 1) {
        // console.log('productData.RESPONSE', response.data);
        const item = response.data.find(
          (elem) => elem.projectName === findText,
        );
        this.form.patchValue({
          projectTo: item?.projectName,
          budgetId: item?.id,
        });
      }
      // this.searchBudgetText.set('');
    });
  }

  form = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    folio: [''],
    documentType: [0],
    observations: [''],
    currencyType: [0],
    valueCurrency: [0],
    customer: [null as Customer | null],
    customerId: [null],
    provider: [null as Provider | null],
    providerRut: [null as string | null],
    providerName: [null as string | null],
    neto: [0],
    taxRate: [0],
    totalValue: [0],
    guideDate: [null as Date | null],
    materials: [[] as Material[]],
    supplierTo: [null as any],
    projectTo: [null as any],
    budgetId: [null as number | null],
    file: [null as any],
    address: [null as string | null],
    zone: [null as string | null],
    commune: [null as string | null],
    netoConversion: [0],
    taxAmount: [0],
    taxConversion: [0],
    totalConversion: [0],
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

  onGuideDateChange(event: Date) {
    // console.log('VoucherDetails.onGuideDateChange', event);
    //actualizar guideDate en form
    this.form.patchValue({
      createAt: event,
    });
  }

  onItemizedMaterialChange(event: Material[]) {
    // actualizar materials en form
    this.form.patchValue({
      materials: event,
    });
    // actualizar itemizedMaterials de input
    this.objInput().materials = event;
  }

  onInputChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.form.patchValue({ [name]: value });
  }

  setFormValue(formLike: Partial<MaterialGuideGeneric>) {
    this.form.reset(this.objInput() as MaterialGuideGeneric);
    const { createAt } = this.objInput();

    formLike = {
      ...formLike,
      createAt: createAt! ?? new Date(),
    } as Partial<MaterialGuideGeneric>;

    this.form.patchValue(formLike as any);
    // console.log('VoucherDetails.setFormValue', this.form.value);
  }

  ngOnInit(): void {
    // console.log('VoucherDetails.ngOnInit', this.objInput());
    this.setFormValue(this.objInput());
    // console.log('VoucherDetails.ngOnInit', this.form.value);
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value;

    const objLike: Partial<MaterialGuideGeneric> = {
      ...(formValue as MaterialGuideGeneric),
    };

    // console.log('VoucherDetails.onSubmit.objInput', this.objInput());
    // console.log('VoucherDetails.onSubmit.formValue', formValue);
    // console.log('VoucherDetails.onSubmit.objLike', objLike);

    if (this.objInput().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.materialService.createMaterial(
          objLike,
          'materials/vouchers' /* , this.imageFileList */,
        ),
      );

      this.router.navigate(['/admin/materials/voucher', response.data]);
    } else {
      await firstValueFrom(
        this.materialService.updateMaterial(
          this.objInput().id.toString(),
          objLike,
          'materials/vouchers',
          /* this.imageFileList */
        ),
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
