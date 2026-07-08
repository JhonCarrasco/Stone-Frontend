import { Component, inject, input, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarDatepicker } from '@shared/components/calendar-datepicker/calendar-datepicker';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { Customer } from '@shared/models/customer.model';
import { Material, MaterialGuideGeneric } from '@shared/models/material.model';
import { Provider } from '@shared/models/provider.model';
import { firstValueFrom } from 'rxjs';
import {
  currencyType,
  getCurrencyTypeDescription,
} from 'src/app/constant/currencyTypeData';
import {
  documentType,
  getDocumentTypeDescription,
} from 'src/app/constant/documentTypeData';
import { ItemizedMaterialTable } from 'src/app/materials/components/itemizedMaterial-table/itemizedMaterial-table';
import { MaterialService } from 'src/app/services/materialService';
import { ProviderService } from 'src/app/services/providerService';
import { environment } from 'src/environments/environment';

const taxRate = environment.taxRate;

@Component({
  selector: 'reception-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ItemizedMaterialTable,
    CalendarDatepicker,
  ],
  templateUrl: './reception-details.html',
})
export class ReceptionDetails implements OnInit {
  objInput = input.required<MaterialGuideGeneric>();
  router = inject(Router);
  fb = inject(FormBuilder);
  materialService = inject(MaterialService);
  providersService = inject(ProviderService);
  wasSaved = signal(false);
  currentType = signal(currencyType);
  documentType = signal(documentType.filter((t) => t.type === 1)); // filtrar solo los tipos de documento de recepción (type === 1)
  currentTypeDescriptionSelected = signal('');
  documentTypeDescriptionSelected = signal('');

  form = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    folio: [''],
    documentType: [0],
    observations: [''],
    currencyType: [0],
    valueCurrency: [null as number | null],
    customer: [null as Customer | null],
    provider: [null as Provider | null],
    providerRut: [null as string | null],
    neto: [0],
    taxRate: [0],
    totalValue: [0],
    guideDate: [null as Date | null],
    materials: [[] as Material[]],
    supplierTo: [null as any],
    projectTo: [null as any],
    budgetId: [null as number | null],
    file: [null as any],
    locationId: [null as number | null],
    address: [null as string | null],
    zone: [null as string | null],
  });

  onSelectedDocumentTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.form.patchValue({
      documentType: Number(value) ?? null,
    });
    this.documentTypeDescriptionSelected.set(
      getDocumentTypeDescription(Number(value) ?? null),
    );
  }
  onGuideDateChange(event: Date) {
    // console.log('ReceptionDetails.onGuideDateChange', event);
    //actualizar guideDate en form
    this.form.patchValue({
      guideDate: event,
    });
  }

  onSelectedCurrentTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.form.patchValue({
      currencyType: Number(value) ?? null,
    });
    this.currentTypeDescriptionSelected.set(
      getCurrencyTypeDescription(Number(value) ?? null),
    );
  }
  onSelectionProviderChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const selectedOption = this.providersResource
      .value()
      ?.data.find((option) => option.personRut === value);

    this.form.patchValue({
      provider: !selectedOption ? null : selectedOption,
      providerRut: !selectedOption ? null : selectedOption.personRut,
    });
  }
  onItemizedMaterialChange(event: Material[]) {
    // console.log('MaterialDetails.onItemizedMaterialsChange', event);
    // actualizar materials en form
    this.form.patchValue({
      materials: event,
    });

    // actualizar itemizedMaterials de input
    this.objInput().materials = event;

    const totalItems = event
      .filter((item) => item.active)
      .reduce((acc, item) => acc + (item.totalValue ?? 0), 0);

    this.form.patchValue({
      neto: totalItems,
      totalValue:
        totalItems * ((100 + (this.form.value?.taxRate ?? taxRate)) / 100),
    });
  }

  onInputChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.form.patchValue({ [name]: value });
  }

  providersResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'providers',
    }),
    loader: ({ request }) => {
      return this.providersService.getProviders({
        limit: request.limit,
        offset: 0,
        searchText: 'providers',
      });
    },
  });

  setFormValue(formLike: Partial<MaterialGuideGeneric>) {
    this.form.reset(this.objInput() as MaterialGuideGeneric);
    this.form.patchValue({
      providerRut: this.objInput().provider?.personRut ?? '',
      guideDate: this.objInput().guideDate ?? new Date(),
      taxRate:
        this.objInput().taxRate > 0 ? this.objInput().taxRate * 100 : taxRate,
    });
    this.form.patchValue(formLike as any);
  }

  CalculateTotals() {
    this.form.patchValue({
      neto: this.objInput().neto ?? 0,
      totalValue: this.objInput().totalValue ?? 0,
    });
  }

  ngOnInit(): void {
    // console.log('ReceptionDetails.ngOnInit.objInput', this.objInput());
    this.setFormValue(this.objInput());
    this.documentTypeDescriptionSelected.set(
      getDocumentTypeDescription(this.objInput().documentType ?? null),
    );
    this.currentTypeDescriptionSelected.set(
      getCurrencyTypeDescription(this.objInput().currencyType ?? null),
    );

    this.CalculateTotals();
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value;

    const objLike: Partial<MaterialGuideGeneric> = {
      ...(formValue as MaterialGuideGeneric),
      customerId: formValue.customer?.id ?? 0,
      providerId: formValue.provider?.id ?? 0,
    };

    console.log('ReceptionDetails.onSubmit.objInput', this.objInput());
    console.log('ReceptionDetails.onSubmit.formValue', formValue);
    console.log('ReceptionDetails.onSubmit.objLike', objLike);

    if (this.objInput().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.materialService.createMaterial(
          objLike,
          'materials/receptions' /* , this.imageFileList */,
        ),
      );

      this.router.navigate(['/admin/materials/reception', response.data]);
    } else {
      await firstValueFrom(
        this.materialService.updateMaterial(
          this.objInput().id.toString(),
          objLike,
          'materials/receptions',
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
