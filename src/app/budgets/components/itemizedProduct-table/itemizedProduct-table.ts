import { ɵNullViewportScroller } from '@angular/common';
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
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { SearchProduct } from '@shared/components/search-product/search-product';
import { ItemizedProduct } from '@shared/models/budget.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'itemized-product-table',
  imports: [ReactiveFormsModule, SearchProduct, FormErrorLabelComponent],
  templateUrl: './itemizedProduct-table.html',
})
export class ItemizedProductTable implements OnInit {
  itemizedProductsInput = input.required<ItemizedProduct[]>();
  itemizedProducts = signal<ItemizedProduct[]>([]);
  @Output() itemizedProductsEvent = new EventEmitter<ItemizedProduct[]>();
  router = inject(Router);
  fb = inject(FormBuilder);
  total = computed(() => this.itemizedProductForm.value.totalValue ?? 0);
  productService = inject(ProductsService);
  searchProductText = signal('');

  itemizedProductForm = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    description: [null as unknown as string, [Validators.required]],
    long: [0],
    width: [0],
    thickness: [0],
    color: [null as unknown as string],
    material: [null as unknown as string, [Validators.required]],
    unitValue: [0],
    amount: [0],
    totalValue: [0],
    budgetId: [0],
    productId: [0],
    unitMeasurement: [null as string | null],
    height: [0],
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
        this.itemizedProductForm.patchValue({
          productId: item?.id,
          material: item?.description,
          color: item?.color ?? null,
        });
      }
    });
  }

  onRemoveItemizedProduct(item: ItemizedProduct) {
    const updatedItems = this.itemizedProducts().map((i) =>
      i === item ? { ...i, active: false } : i,
    );
    this.itemizedProducts.set(updatedItems);
    this.itemizedProductsEvent.emit(this.itemizedProducts());
  }

  onEditItemizedProduct(item: ItemizedProduct) {
    this.itemizedProductForm.setValue({ ...item });
    // this.itemizedProductForm.setValue({
    //   id: item.id,
    //   active: item.active,
    //   createAt: item.createAt,
    //   updatedAt: item.updatedAt,
    //   description: item.description,
    //   long: item.long,
    //   width: item.width,
    //   thickness: item.thickness,
    //   color: item.color,
    //   material: item.material,
    //   unitValue: item.unitValue,
    //   amount: item.amount,
    //   totalValue: item.totalValue,
    //   budgetId: item.budgetId,
    // });
  }

  onInputTextChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.itemizedProductForm.patchValue({ [name]: value });
  }
  onInputNumberChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    if (name === 'unitValue' || name === 'amount') {
      const unitValue =
        name === 'unitValue'
          ? Number(value)
          : (this.itemizedProductForm.value.unitValue ?? 0);
      const amount =
        name === 'amount'
          ? Number(value)
          : (this.itemizedProductForm.value.amount ?? 0);
      this.itemizedProductForm.patchValue({
        totalValue: unitValue * amount,
      });
    }
    this.itemizedProductForm.patchValue({ [name]: Number(value) });
  }

  onAddItemizedProduct() {
    this.itemizedProductForm.patchValue({
      totalValue:
        (this.itemizedProductForm.value.unitValue ?? 0) *
        (this.itemizedProductForm.value.amount ?? 0),
    });
    const formValue = this.itemizedProductForm.value as ItemizedProduct;

    const { id } = this.itemizedProductForm.value;
    if (id && id > 0) {
      //edit
      const filtered = this.itemizedProducts().filter((i) => i.id !== id);
      this.itemizedProducts.set([...filtered, formValue]);
      this.itemizedProductsEvent.emit(this.itemizedProducts());
    } else {
      //add
      this.itemizedProducts.set([...this.itemizedProducts(), formValue]);
      this.itemizedProductsEvent.emit(this.itemizedProducts());
    }

    this.resetForm();
  }

  resetForm() {
    this.itemizedProductForm.reset({
      id: 0,
      active: true,
      createAt: null,
      updatedAt: null,
      description: '',
      long: 0,
      width: 0,
      thickness: 0,
      color: '',
      material: '',
      unitValue: 0,
      amount: 0,
      totalValue: 0,
      budgetId: 0,
    });
  }

  ngOnInit(): void {
    this.itemizedProducts.set([...this.itemizedProductsInput()]);
  }
}
