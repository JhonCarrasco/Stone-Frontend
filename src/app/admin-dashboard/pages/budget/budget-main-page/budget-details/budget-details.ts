import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { Budget } from '@shared/models/budget.model';
import { BudgetService } from 'src/app/services/budgetService';
import { SharedService } from 'src/app/services/shared.services';
import {
  ItemizedProduct,
  ItemizedService,
} from '../../../../../shared/models/budget.model';
import { SearchCustomer } from '@shared/components/search-customer/search-customer';
import { Customer } from '@shared/models/customer.model';
import { ItemizedProductTable } from 'src/app/budgets/components/itemizedProduct-table/itemizedProduct-table';
import { ItemizedServiceTable } from 'src/app/budgets/components/itemizedService-table/itemizedService-table';
import { firstValueFrom } from 'rxjs';
import {
  getStateDescription,
  statesBudget,
} from '../../../../../constant/budgetData';
import { CustomerService } from 'src/app/services/customer.service';
import { getZoneDescription, zoneList } from 'src/app/constant/zoneData';
import { environment } from 'src/environments/environment';
import { CalendarDatepicker } from '@shared/components/calendar-datepicker/calendar-datepicker';
import { InputFile } from '@shared/components/input-file/input-file';
import { FileDrive } from '@shared/models/fileDrive.model';
import { DriveService } from 'src/app/services/driveService';

const taxRate = environment.taxRate;

@Component({
  selector: 'budget-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    SearchCustomer,
    ItemizedProductTable,
    ItemizedServiceTable,
    CalendarDatepicker,
    InputFile,
  ],
  templateUrl: './budget-details.html',
})
export class BudgetDetails implements OnInit {
  budget = input.required<Budget>();
  router = inject(Router);
  fb = inject(FormBuilder);
  budgetService = inject(BudgetService);
  sharedService = inject(SharedService);
  customerService = inject(CustomerService);
  driveService = inject(DriveService);
  wasSaved = signal(false);
  statesBudget = signal(statesBudget);
  stateDescriptionSelected = signal('');
  zoneList = signal(zoneList);
  zoneDescriptionSelected = signal('');
  totalValueCost = computed(() => this.budget().totalValue ?? 0);
  subTotalCost = computed(() => this.budget().subTotal ?? 0);
  netoCost = computed(() => this.budget().neto ?? 0);
  taxRateCost = computed(() => this.budget().taxRate ?? Number(taxRate));
  taxRateCostTotal = signal(0);
  fileList: File[] | undefined = undefined;

  budgetForm = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    projectName: [''],
    address: [''],
    description: [''],
    material: [''],
    subTotal: [0],
    neto: [0],
    taxRate: [Number(taxRate)],
    totalValue: [0],
    customerId: [0],
    displayName: [''],
    email: [''],
    phone: [''],
    state: [null as number | null],
    zone: [null as number | null],
    contactPerson: [''],
    phoneContact: [''],
    taxRateTotal: [0],
    itemizedProducts: [[] as ItemizedProduct[]],
    itemizedServices: [[] as ItemizedService[]],
    files: [[] as (File | FileDrive)[]],
    documentType: [0],
  });

  onRemoveFileEvent(fileName: string) {
    // get file from objInput().files by name
    const fileToRemove = this.budget().files?.find(
      (file) => file.fileName === fileName,
    );

    if (fileToRemove && fileToRemove.folderParentId && fileToRemove.fileId) {
      this.driveService.deleteFilesByFileId(fileToRemove.fileId).subscribe();
    }
  }

  onFilesEvent(event: File[]) {
    this.fileList = event;
  }

  onCreateAtChange(event: Date) {
    this.budgetForm.patchValue({
      createAt: event,
    });
  }

  onInputBudgetDetailChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.budgetForm.patchValue({ [name]: value });
  }

  onSelectedStateChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.budgetForm.patchValue({
      state: Number(value) ?? null,
    });
    this.stateDescriptionSelected.set(
      getStateDescription(Number(value) ?? null),
    );
  }

  onSelectedZoneChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.budgetForm.patchValue({
      zone: Number(value) ?? null,
    });
    this.zoneDescriptionSelected.set(getZoneDescription(Number(value) ?? null));
  }

  onSelectionCustomerChange(event: Customer) {
    //set customerId, displayName, email, phone in budgetForm
    if (!event) return;
    this.budgetForm.patchValue({
      customerId: event.id,
      displayName: event.person.displayName,
      email: event.email,
      phone: event.phone,
    });
  }

  // event handler para actualizar itemizedProducts en budgetForm
  onItemizedProductsChange(event: ItemizedProduct[]) {
    // console.log('BudgetDetails.onItemizedProductsChange', event);
    // actualizar itemizedProducts en budgetForm
    this.budgetForm.patchValue({
      itemizedProducts: event,
    });
    // actualizar itemizedProducts en budget signal
    this.budget().itemizedProducts = event;

    // sumar subtotales de itemizedProducts, itemizedServices y actualizar subTotal, neto de budgetForm y budget signal
    const TotalNeto = this.computedTosubTotal();
    this.budgetForm.patchValue({
      subTotal: TotalNeto,
      neto: TotalNeto,
      totalValue:
        TotalNeto * ((100 + (this.budgetForm.value?.taxRate ?? taxRate)) / 100), // Calculate total value with tax
      taxRateTotal:
        TotalNeto * ((this.budgetForm.value?.taxRate ?? taxRate) / 100), // Calculate tax total
    });
  }

  // event handler para actualizar itemizedServices en budgetForm
  onItemizedServicesChange(event: ItemizedService[]) {
    // console.log('BudgetDetails.onItemizedServicesChange', event);
    // actualizar itemizedServices en budgetForm
    this.budgetForm.patchValue({
      itemizedServices: event,
    });
    // actualizar itemizedServices en budget signal
    this.budget().itemizedServices = event;

    // sumar subtotales de itemizedProducts, itemizedServices y actualizar subTotal, neto de budgetForm y budget signal
    const TotalNeto = this.computedTosubTotal();
    this.budgetForm.patchValue({
      subTotal: TotalNeto,
      neto: TotalNeto,
      totalValue:
        TotalNeto * ((100 + (this.budgetForm.value?.taxRate ?? taxRate)) / 100), // Calculate total value with tax
      taxRateTotal:
        TotalNeto * ((this.budgetForm.value?.taxRate ?? taxRate) / 100), // Calculate tax total
    });
  }

  computedTosubTotal() {
    const subTotalProducts = this.budget()
      .itemizedProducts.filter((item) => item.active)
      .reduce((sum, product) => sum + product.totalValue, 0);
    const subTotalServices = this.budget()
      .itemizedServices.filter((item) => item.active)
      .reduce((sum, service) => sum + service.totalValue, 0);
    return subTotalProducts + subTotalServices;
  }

  setFormValue(formLike: Partial<Budget>) {
    this.budgetForm.reset({ ...this.budget(), files: [] } as Budget);
    formLike = {
      ...formLike,
      documentType: 8, // default to Presupuesto
    } as Partial<Budget>;
    this.budgetForm.patchValue(formLike as any);

    this.fileList = this.budget().files?.map((file) => {
      const blob = new Blob([file.fileId], { type: file.contentType });
      return new File([blob], file.fileName, { type: file.contentType });
    }) as File[];
  }

  ngOnInit(): void {
    this.setFormValue({
      ...this.budget(),
      state: this.budget().state ?? 1,
    });
    this.stateDescriptionSelected.set(
      getStateDescription(this.budget().state ?? null),
    );
    this.zoneDescriptionSelected.set(
      getZoneDescription(this.budget().zone ?? null),
    );
    this.taxRateCostTotal.set(this.budget().taxRateTotal ?? 0);
    this.budgetForm.patchValue({
      displayName: this.budget().customer.displayName,
      email: this.budget().customer.email,
      phone: this.budget().customer.phone,
      taxRate:
        this.budget().taxRate > 0 ? this.budget().taxRate * 100 : taxRate,
      taxRateTotal:
        this.computedTosubTotal() * (this.budgetForm.value?.taxRate ?? taxRate), // Calculate tax total
    });
  }

  avoidEnter(event: Event): void {
    const target = event.target as HTMLElement;

    // Si no proviene de un textarea, bloquea el envío
    if (target.tagName !== 'TEXTAREA') {
      event.preventDefault();
    }
  }

  async onSubmit() {
    const isValid = this.budgetForm.valid;
    this.budgetForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.budgetForm.value;

    const budgetLike: Partial<Budget> = {
      ...(formValue as Budget),
    };

    if (this.budget().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.budgetService.createBudget(budgetLike, this.fileList),
      );

      this.router.navigate(['/admin/budgets', response.data]);
    } else {
      const customerObject = await firstValueFrom(
        this.customerService.getCustomerById(
          this.budget().customerId.toString(),
        ),
      );

      if (customerObject.data.id !== budgetLike.customerId) return;

      budgetLike.customer = customerObject.data;
      const response = await firstValueFrom(
        this.budgetService.updateBudget(
          this.budget().id.toString(),
          budgetLike,
          this.fileList,
        ),
      );

      this.budget().files = [...(this.budget().files ?? []), ...response.data];

      this.budgetForm.patchValue({
        files: [...(this.budgetForm.value.files ?? []), ...response.data],
      });
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
