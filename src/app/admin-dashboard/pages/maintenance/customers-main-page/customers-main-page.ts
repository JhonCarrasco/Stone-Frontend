import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchCustomer } from '@shared/components/search-customer/search-customer';
import { CustomerTableComponent } from 'src/app/customer/components/customer-table-component/customer-table.component';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'customers-main-page',
  imports: [
    CustomerTableComponent,
    PaginationComponent,
    RouterLink,
    SearchCustomer,
  ],
  templateUrl: './customers-main-page.html',
})
export class CustomersMainPage {
  customerService = inject(CustomerService);
  paginationService = inject(PaginationService);
  customersPerPage = signal(10);
  searchCustomerText = signal('');

  customersResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.customersPerPage(),
      searchText: this.searchCustomerText(), //TODO: add search text signal and bind to input from html page
    }),
    loader: ({ request }) => {
      return this.customerService.getCustomerByNameOrRut({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
      });
    },
  });

  onSearchCustomerChange(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.searchCustomerText.set(value);
    const productData$ = this.customerService.getCustomerByNameOrRut({
      offset:
        (this.paginationService.currentPage() - 1) * this.customersPerPage(),
      limit: this.customersPerPage(),
      searchText: value,
    });

    productData$.subscribe((response) => {
      this.customersResource.set(response);
      console.log('onSearchCustomerChange', response);
      // this.searchProductText.set('');
    });
  }
}
