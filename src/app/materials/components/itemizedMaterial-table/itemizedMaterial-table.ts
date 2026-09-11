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
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchProduct } from '@shared/components/search-product/search-product';
import { Material } from '@shared/models/material.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'itemized-material-table',
  imports: [ReactiveFormsModule, SearchProduct],
  templateUrl: './itemizedMaterial-table.html',
})
export class ItemizedMaterialTable implements OnInit {
  itemizedMaterialsInput = input.required<Material[]>();
  itemizedMaterials = signal<Material[]>([]);
  @Output() itemizedMaterialsEvent = new EventEmitter<Material[]>();
  router = inject(Router);
  fb = inject(FormBuilder);
  total = computed(() => this.itemizedMaterialForm.value.totalValue ?? 0);
  isVoucher = input.required<boolean>();
  productService = inject(ProductsService);
  searchProductText = signal('');

  itemizedMaterialForm = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    productCode: [''],
    description: ['', [Validators.required]],
    unitMeasurement: [null as string | null],
    quantity: [0],
    unitValue: [0],
    totalValue: [0],
    productId: [null as number | null],
    voucherId: [null as number | null],
    receptionId: [0],
    dispatchId: [null as number | null],
    guideDate: [null as Date | null],
  });

  productsResource = rxResource({
    request: () => ({
      searchText: this.searchProductText(),
      page: 0,
      limit: 100,
    }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        searchText: request.searchText,
        offset: request.page,
        limit: request.limit,
      });
    },
  });

  onSearchProductChange(event: string) {
    // console.log('ItemizedMaterialTable.onSearchProductChange', event);
    this.searchProductText.set(event);
    const searchSplit = event.split('-');
    const findText = searchSplit.length > 1 ? searchSplit[1] : searchSplit[0];
    const productData$ = this.productService.getProducts({
      offset: 0,
      limit: 100,
      searchText: findText,
    });

    // console.log('ItemizedMaterialTable.onSearchProductChange.EVENT', event);

    productData$.subscribe((response) => {
      this.productsResource.set(response);
      // console.log('ItemizedMaterialTable.onSearchProductChange.RESPONSE', response);
      if (response.data.length === 1) {
        // console.log('productData.RESPONSE', response.data);
        const item = response.data.find(
          (elem) =>
            elem.description === findText || elem.productCode === findText,
        );
        this.itemizedMaterialForm.patchValue({
          productCode: item?.productCode,
          productId: item?.id,
          description: item?.description,
          unitMeasurement: item?.unitMeasurement ?? null,
        });
      }
    });
  }

  onAddItemizedMaterial() {
    this.itemizedMaterialForm.patchValue({
      totalValue:
        (this.itemizedMaterialForm.value.unitValue ?? 0) *
        (this.itemizedMaterialForm.value.quantity ?? 0),
    });
    const formValue = this.itemizedMaterialForm.value as Material;

    const { id } = this.itemizedMaterialForm.value;
    if (id && id > 0) {
      //edit
      const filtered = this.itemizedMaterials().filter((i) => i.id !== id);
      this.itemizedMaterials.set([...filtered, formValue]);
      this.itemizedMaterialsEvent.emit(this.itemizedMaterials());
    } else {
      //add
      this.itemizedMaterials.set([...this.itemizedMaterials(), formValue]);
      this.itemizedMaterialsEvent.emit(this.itemizedMaterials());
    }

    this.resetForm();
  }

  onInputNumberChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    if (name === 'unitValue' || name === 'quantity') {
      const unitValue =
        name === 'unitValue'
          ? Number(value)
          : (this.itemizedMaterialForm.value.unitValue ?? 0);
      const quantity =
        name === 'quantity'
          ? Number(value)
          : (this.itemizedMaterialForm.value.quantity ?? 0);
      this.itemizedMaterialForm.patchValue({
        totalValue: unitValue * quantity,
      });
    }
    this.itemizedMaterialForm.patchValue({ [name]: Number(value) });
  }
  onInputTextChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.itemizedMaterialForm.patchValue({ [name]: value });
  }
  onEditItemizedMaterial(item: Material) {
    this.itemizedMaterialForm.patchValue({ ...item });
  }
  onRemoveItemizedMaterial(item: Material) {
    const updatedItems = this.itemizedMaterials().map((i) =>
      i === item ? { ...i, active: false } : i,
    );
    this.itemizedMaterials.set(updatedItems);
    this.itemizedMaterialsEvent.emit(this.itemizedMaterials());
  }

  resetForm() {
    this.itemizedMaterialForm.reset({
      id: 0,
      active: true,
      createAt: null,
      updatedAt: null,
      productCode: '',
      description: '',
      unitMeasurement: null,
      quantity: 0,
      unitValue: 0,
      totalValue: 0,
      productId: null,
      voucherId: null,
      receptionId: 0,
      dispatchId: null,
      guideDate: null,
    });
  }

  ngOnInit(): void {
    this.itemizedMaterials.set([...this.itemizedMaterialsInput()]);
  }
}
