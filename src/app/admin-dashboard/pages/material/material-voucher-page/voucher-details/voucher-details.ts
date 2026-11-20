import { Component, inject, input, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarDatepicker } from '@shared/components/calendar-datepicker/calendar-datepicker';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { InputFile } from '@shared/components/input-file/input-file';
import { SearchBudget } from '@shared/components/search-budget/search-budget';
import { Customer } from '@shared/models/customer.model';
import { FileDrive } from '@shared/models/fileDrive.model';
import { Material, MaterialGuideGeneric } from '@shared/models/material.model';
import { Provider } from '@shared/models/provider.model';
import { firstValueFrom } from 'rxjs';
import {
  DocumentDriveType,
  documentType,
} from 'src/app/constant/documentTypeData';
import { ItemizedMaterialTable } from 'src/app/materials/components/itemizedMaterial-table/itemizedMaterial-table';
import { BudgetService } from 'src/app/services/budgetService';
import { DriveService } from 'src/app/services/driveService';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'voucher-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ItemizedMaterialTable,
    CalendarDatepicker,
    SearchBudget,
    InputFile,
  ],
  templateUrl: './voucher-details.html',
})
export class VoucherDetails implements OnInit {
  objInput = input.required<MaterialGuideGeneric>();
  router = inject(Router);
  fb = inject(FormBuilder);
  materialService = inject(MaterialService);
  budgetService = inject(BudgetService);
  driveService = inject(DriveService);
  wasSaved = signal(false);
  searchBudgetText = signal('');
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
    files: [[] as (File | FileDrive)[]],
    address: [null as string | null],
    zone: [null as string | null],
    commune: [null as string | null],
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
          projectTo: item?.projectName,
          budgetId: item?.id,
        });
      }
    });
  }

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

  onFilesEvent(event: File[]) {
    this.fileList = event;
  }

  onGuideDateChange(event: Date) {
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
    this.form.reset({
      ...this.objInput(),
      files: [],
    });
    const { createAt } = this.objInput();

    formLike = {
      ...formLike,
      createAt: createAt! ?? new Date(),
      documentType: 5, // default to VALE DE CONSUMO
    } as Partial<MaterialGuideGeneric>;

    this.form.patchValue(formLike as any);

    this.fileList = this.objInput().files?.map((file) => {
      const blob = new Blob([file.fileId], { type: file.contentType });
      return new File([blob], file.fileName, { type: file.contentType });
    }) as File[];
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
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value;

    const objLike: Partial<MaterialGuideGeneric> = {
      ...(formValue as MaterialGuideGeneric),
    };

    if (this.objInput().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.materialService.createMaterial(
          objLike,
          'materials/vouchers',
          this.fileList,
        ),
      );

      this.router.navigate(['/admin/materials/voucher', response.data]);
    } else {
      const response = await firstValueFrom(
        this.materialService.updateMaterial(
          this.objInput().id.toString(),
          objLike,
          'materials/vouchers',
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
