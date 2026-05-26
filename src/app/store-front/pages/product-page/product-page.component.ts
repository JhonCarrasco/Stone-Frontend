import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { ProductCarouselComponent } from '../../../products/components/product-carousel/product-carousel.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  productsPerPage = signal(10);

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
      searchText: '', //TODO: add search text signal and bind to input from html page
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
      });
    },
  });
}
