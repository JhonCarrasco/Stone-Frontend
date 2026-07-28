import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '@shared/models/customer.model';

@Component({
  selector: 'customer-table',
  imports: [RouterLink],
  templateUrl: './customer-table.component.html',
})
export class CustomerTableComponent {
  customers = input.required<Customer[]>();
}
