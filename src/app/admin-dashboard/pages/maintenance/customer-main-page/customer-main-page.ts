import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerDetails } from './customer-details/customer-details';

@Component({
  selector: 'customer-main-page',
  imports: [CustomerDetails],
  templateUrl: './customer-main-page.html',
})
export class CustomerMainPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  customerService = inject(CustomerService);

  customerId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id'])),
  );

  customerResource = rxResource({
    request: () => ({ id: this.customerId() }),
    loader: ({ request }) => {
      return this.customerService.getCustomerById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.customerResource.error()) {
      this.router.navigate(['/admin/customers']);
    }
  });
}
