import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductTableComponent } from '@products/components/product-table/product-table.component';
import { ProductsService } from 'src/app/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchProduct } from '@shared/components/search-product/search-product';

@Component({
  selector: 'app-products-admin-page',
  imports: [
    ProductTableComponent,
    PaginationComponent,
    RouterLink,
    SearchProduct,
  ],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  productsPerPage = signal(10);
  searchProductText = signal('');

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
      searchText: this.searchProductText(), //TODO: add search text signal and bind to input from html page
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
      });
    },
  });

  onSearchProductChange(event: string) {
    this.searchProductText.set(event);
    const productData$ = this.productsService.getProducts({
      offset:
        (this.paginationService.currentPage() - 1) * this.productsPerPage(),
      limit: this.productsPerPage(),
      searchText: event,
    });

    productData$.subscribe((response) => {
      this.productsResource.set(response);
      console.log('onSearchProductChange', response);
      // this.searchProductText.set('');
    });
  }
}
