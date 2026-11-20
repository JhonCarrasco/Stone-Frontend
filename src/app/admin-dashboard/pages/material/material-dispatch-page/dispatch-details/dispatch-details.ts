import { Component, inject, input, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarDatepicker } from '@shared/components/calendar-datepicker/calendar-datepicker';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { InputFile } from '@shared/components/input-file/input-file';
import { Customer } from '@shared/models/customer.model';
import { FileDrive } from '@shared/models/fileDrive.model';
import { Material, MaterialGuideGeneric } from '@shared/models/material.model';
import { Provider } from '@shared/models/provider.model';
import { firstValueFrom } from 'rxjs';
import {
  currencyTypeData,
  getCurrencyTypeDescription,
} from 'src/app/constant/currencyTypeData';
import {
  DocumentDriveType,
  documentType,
  getDocumentTypeDescription,
} from 'src/app/constant/documentTypeData';
import { getZoneDescription, zoneList } from 'src/app/constant/zoneData';
import { ItemizedMaterialTable } from 'src/app/materials/components/itemizedMaterial-table/itemizedMaterial-table';
import { DriveService } from 'src/app/services/driveService';
import { MaterialService } from 'src/app/services/materialService';
import { ProviderService } from 'src/app/services/providerService';
import { SharedService } from 'src/app/services/shared.services';
import { environment } from 'src/environments/environment';

const _taxRate = environment.taxRate;
@Component({
  selector: 'dispatch-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ItemizedMaterialTable,
    CalendarDatepicker,
    InputFile,
  ],
  templateUrl: './dispatch-details.html',
})
export class DispatchDetails implements OnInit {
  objInput = input.required<MaterialGuideGeneric>();
  router = inject(Router);
  fb = inject(FormBuilder);
  materialService = inject(MaterialService);
  providersService = inject(ProviderService);
  sharedService = inject(SharedService);
  driveService = inject(DriveService);
  wasSaved = signal(false);
  currentTypeData = signal(currencyTypeData);
  documentType = signal(
    documentType.filter((t) => t.type === DocumentDriveType.Dispatch),
  ); // filtrar solo los tipos de documento de dispatch (type === 2)
  zoneList = signal(zoneList);
  zoneDescriptionSelected = signal('');

  fileList: File[] | undefined = undefined;

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
    files: [[] as (File | FileDrive)[]],
    address: [null as string | null],
    zone: [null as number | null],
    commune: [null as number | null],
    netoConversion: [0],
    taxAmount: [0],
    taxConversion: [0],
    totalConversion: [0],
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

  onSelectedDocumentTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.form.patchValue({
      documentType: Number(value) ?? null,
    });
    // this.documentTypeDescriptionSelected.set(
    //   getDocumentTypeDescription(Number(value) ?? null),
    // );
  }
  onGuideDateChange(event: Date) {
    //actualizar guideDate en form
    this.form.patchValue({
      guideDate: event,
    });
  }

  onSelectedCurrentTypeChange(event: Event) {
    const { name, value } = event.target as HTMLSelectElement;
    this.form.patchValue({
      currencyType: Number(value) ?? null,
      valueCurrency: null, // reset each new selected item
      netoConversion: null,
      taxConversion: null,
      totalConversion: null,
      taxAmount:
        ((this.form.value.neto ?? 0) * (this.form.value.taxRate ?? 0)) / 100,
    });
    // this.currentTypeDescriptionSelected.set(
    //   getCurrencyTypeDescription(Number(value) ?? null),
    // );
  }

  async onSelectionProviderChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    const providerFiltered = await firstValueFrom(
      this.providersService.getProviders({
        limit: 0,
        offset: 0,
        searchText: value,
        uri: 'providers',
      }),
    );

    // set providerResource to the filtered response
    this.providersResource.set(providerFiltered);

    const filteredSelectedOption = providerFiltered.data.find(
      (option) => option.person.rut === value,
    );

    this.form.patchValue({
      provider: filteredSelectedOption ?? null,
      providerRut: filteredSelectedOption?.person.rut ?? null,
      providerName: filteredSelectedOption?.person.displayName ?? null,
    });
  }

  onSelectedZoneChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.form.patchValue({
      zone: Number(value) ?? null,
    });
    this.zoneDescriptionSelected.set(getZoneDescription(Number(value) ?? null));
  }

  onSelectedCommuneChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.form.patchValue({
      commune: Number(value),
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
        totalItems * ((100 + (this.form.value?.taxRate ?? _taxRate)) / 100),
    });
  }

  onInputChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    if (name === 'valueCurrency') {
      const valueCurrency = Number(value);
      if (valueCurrency > 0) {
        this.CalculateTotals();
      }
      return;
    }
    this.form.patchValue({ [name]: value });
  }

  providersResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: '',
      uri: 'providers',
    }),
    loader: ({ request }) => {
      return this.providersService.getProviders({
        limit: request.limit,
        offset: request.page,
        searchText: request.searchText,
        uri: request.uri,
      });
    },
  });

  communesResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'Communes',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/Communes', {
        limit: request.limit,
        offset: 0,
        searchText: 'Communes',
      });
    },
  });

  setFormValue(formLike: Partial<MaterialGuideGeneric>) {
    this.form.reset({
      ...this.objInput(),
      files: [],
    });
    const { provider, guideDate, taxRate } = this.objInput();

    formLike = {
      ...formLike,
      providerRut: provider?.person.rut ?? null,
      providerName: provider?.person.displayName ?? null,
      guideDate: guideDate ?? new Date(),
      taxRate: taxRate ? taxRate * 100 : _taxRate, // valor entero para vista
    } as unknown as Partial<MaterialGuideGeneric>;

    this.form.patchValue(formLike as any);

    this.fileList = this.objInput().files?.map((file) => {
      const blob = new Blob([file.fileId], { type: file.contentType });
      return new File([blob], file.fileName, { type: file.contentType });
    }) as File[];
  }

  CalculateTotals() {
    const { totalValue, taxRate, neto } = this.objInput();
    const { valueCurrency: valueCurrencyForm, currencyType } = this.form.value;

    const isValueCurrency = valueCurrencyForm && Number(currencyType) > 1;

    this.form.patchValue({
      neto: neto ?? 0,
      totalValue: totalValue ?? 0,
      taxAmount: neto * taxRate,
      netoConversion: isValueCurrency ? neto / Number(valueCurrencyForm) : null,
      taxConversion: isValueCurrency
        ? (neto * taxRate) / Number(valueCurrencyForm)
        : null,
      totalConversion: isValueCurrency
        ? (neto * (taxRate + 1)) / Number(valueCurrencyForm)
        : null,
    });
  }

  avoidEnter(event: Event): void {
    const target = event.target as HTMLElement;
    // Si no proviene de un textarea, bloquea el envío
    if (target.tagName !== 'TEXTAREA') {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.setFormValue(this.objInput());
    this.zoneDescriptionSelected.set(
      getZoneDescription(this.objInput().zone ?? null),
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
      providerId: formValue.provider?.id ?? 0,
    };

    if (this.objInput().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.materialService.createMaterial(
          objLike,
          'materials/dispatches',
          this.fileList,
        ),
      );

      this.router.navigate(['/admin/materials/dispatch', response.data]);
    } else {
      const response = await firstValueFrom(
        this.materialService.updateMaterial(
          this.objInput().id.toString(),
          objLike,
          'materials/dispatches',
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

      // setTimeout(() => {
      //   console.log('update.response', response);
      //   console.log('update.objInput', this.objInput().files);
      //   console.log('update.form', this.form.value.files);
      //   console.log('update.fileList', this.fileList);
      // }, 5000);
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
