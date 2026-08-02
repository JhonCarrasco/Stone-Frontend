import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from '@shared/models/product.model';
import { firstValueFrom } from 'rxjs';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ProviderService } from 'src/app/services/providerService';
import { rxResource } from '@angular/core/rxjs-interop';
import { SharedService } from 'src/app/services/shared.services';

@Component({
  selector: 'product-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  productsService = inject(ProductsService);
  providersService = inject(ProviderService);
  sharedService = inject(SharedService);
  wasSaved = signal(false);

  // items = signal([
  //   { id: 1, name: 'Angular 19' },
  //   { id: 2, name: 'Signals' },
  //   { id: 3, name: 'Modern Flow' },
  // ]);

  // selectedValue = signal<number | null>(null);
  selectedProviderValue = signal<string | null>(null);
  selectedCategoryValue = signal<string | null>(null);
  selectedManufacturerValue = signal<string | null>(null);
  selectedUnitMeasurementValue = signal<string | null>(null);

  productForm = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    productCode: ['', Validators.required],
    description: ['', Validators.required],
    long: [0, [Validators.required, Validators.min(0)]],
    width: [0, [Validators.required, Validators.min(0)]],
    thickness: [0, [Validators.required, Validators.min(0)]],
    color: [''],
    unitMeasurement: [''],
    unitValue: [0, [Validators.required, Validators.min(0)]],
    manufacturerName: [
      '',
      [
        Validators.required,
        // existsInListValidator(
        //   this.sharedService,
        //   'shareds/Manufacturers',
        //   this.product().id,
        // ),
      ],
    ],
    categoryName: [null as string | null],
    providerName: [null as string | null],
    manufacturerId: [0],
    categoryId: [null as number | null],
    providerId: [null as number | null],
  });

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

  categoriesResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'Categories',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/categories', {
        limit: request.limit,
        offset: 0,
        searchText: 'Categories',
      });
    },
  });

  manufacturersResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'Manufacturers',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/Manufacturers', {
        limit: request.limit,
        offset: 0,
        searchText: 'Manufacturers',
      });
    },
  });

  unitMeasurementsResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'UnitMeasurements',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/UnitMeasurements', {
        limit: request.limit,
        offset: 0,
        searchText: 'UnitMeasurements',
      });
    },
  });

  onSelectionProviderChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const selectedOption = this.providersResource
      .value()
      ?.data.find((option) => option.displayName === value);

    this.productForm.patchValue({
      providerId: !selectedOption ? null : selectedOption.id,
      providerName: !selectedOption ? null : selectedOption.displayName,
    });
  }

  onSelectionCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const selectedOption = this.categoriesResource
      .value()
      ?.data.find((option) => option.description === value);

    this.productForm.patchValue({
      categoryId: !selectedOption ? null : selectedOption.id,
      categoryName: !selectedOption ? null : selectedOption.description,
    });
  }

  onSelectionManufacturerChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const selectedOption = this.manufacturersResource
      .value()
      ?.data.find((option) => option.description === value);

    if (selectedOption) {
      this.productForm.patchValue({
        manufacturerId: selectedOption.id,
        manufacturerName: selectedOption.description,
      });
    }
  }

  onSelectionUnitMeasurementChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedUnitMeasurementValue.set(value);
  }

  ngOnInit(): void {
    // console.log('product-details', this.product());
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as Product);
    // this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    // this.productForm.patchValue(formLike as any);
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as Product),
    };

    if (this.product().id == 0) {
      // Crear producto
      const product = await firstValueFrom(
        this.productsService.createProduct(
          productLike /* , this.imageFileList */,
        ),
      );

      this.router.navigate(['/admin/products', product.data]);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(
          this.product().id.toString(),
          productLike,
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
