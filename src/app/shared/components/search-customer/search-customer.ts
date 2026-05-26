import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'search-customer',
  imports: [],
  templateUrl: './search-customer.html',
})
export class SearchCustomer {
  customerService = inject(CustomerService);
  searchCustomerText = signal('');
  customersFound = signal<Customer[]>([]);
  @Output() customerEvent = new EventEmitter<Customer>();

  onSelectionSearchCustomerChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchCustomerText.set(value);
    this.customerEvent.emit(
      this.customersFound().find((c) => c.displayName === value)!,
    );
  }

  onSearchCustomerBtn() {
    const customerData$ = this.customerService.getCustomerByNameOrRut({
      offset: 0,
      limit: 10,
      searchText: this.searchCustomerText(),
    });

    customerData$.subscribe((response) => {
      this.customersFound.set(response?.data ?? []);
      this.searchCustomerText.set('');
    });
  }
}
