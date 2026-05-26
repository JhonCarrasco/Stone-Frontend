import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemizedService } from '@shared/models/budget.model';

@Component({
  selector: 'itemized-service-table',
  imports: [ReactiveFormsModule],
  templateUrl: './itemizedService-table.html',
})
export class ItemizedServiceTable implements OnInit {
  itemizedServicesInput = input.required<ItemizedService[]>();
  itemizedServices = signal<ItemizedService[]>([]);
  @Output() itemizedServicesEvent = new EventEmitter<ItemizedService[]>();
  router = inject(Router);
  fb = inject(FormBuilder);
  total = computed(() => this.itemizedServiceForm.value.totalValue ?? 0);

  itemizedServiceForm = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    description: ['', [Validators.required]],
    unitValue: [0],
    amount: [0],
    totalValue: [0],
    budgetId: [0],
  });

  onInputTextChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.itemizedServiceForm.patchValue({ [name]: value });
  }
  onInputNumberChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    if (name === 'unitValue' || name === 'amount') {
      const unitValue =
        name === 'unitValue'
          ? Number(value)
          : (this.itemizedServiceForm.value.unitValue ?? 0);
      const amount =
        name === 'amount'
          ? Number(value)
          : (this.itemizedServiceForm.value.amount ?? 0);
      this.itemizedServiceForm.patchValue({
        totalValue: unitValue * amount,
      });
    }
    this.itemizedServiceForm.patchValue({ [name]: Number(value) });
  }

  onEditItemizedService(item: ItemizedService) {
    this.itemizedServiceForm.setValue({
      id: item.id,
      active: item.active,
      createAt: item.createAt,
      updatedAt: item.updatedAt,
      description: item.description,
      unitValue: item.unitValue,
      amount: item.amount,
      totalValue: item.totalValue,
      budgetId: item.budgetId,
    });
  }
  onRemoveItemizedService(item: ItemizedService) {
    const updatedItems = this.itemizedServices().map((i) =>
      i === item ? { ...i, active: false } : i,
    );
    this.itemizedServices.set(updatedItems);
    this.itemizedServicesEvent.emit(this.itemizedServices());
  }

  onAddItemizedService() {
    this.itemizedServiceForm.patchValue({
      totalValue:
        (this.itemizedServiceForm.value.unitValue ?? 0) *
        (this.itemizedServiceForm.value.amount ?? 0),
    });
    const formValue = this.itemizedServiceForm.value as ItemizedService;
    const { id } = this.itemizedServiceForm.value;
    if (id && id > 0) {
      //edit
      const filtered = this.itemizedServices().filter((i) => i.id !== id);
      this.itemizedServices.set([...filtered, formValue]);
      this.itemizedServicesEvent.emit(this.itemizedServices());
    } else {
      //add
      this.itemizedServices.set([...this.itemizedServices(), formValue]);
      this.itemizedServicesEvent.emit(this.itemizedServices());
    }

    this.itemizedServiceForm.reset({
      id: 0,
      active: true,
      createAt: null,
      updatedAt: null,
      description: '',
      unitValue: 0,
      amount: 0,
      totalValue: 0,
      budgetId: 0,
    });
  }

  ngOnInit(): void {
    this.itemizedServices.set([...this.itemizedServicesInput()]);
  }
}
