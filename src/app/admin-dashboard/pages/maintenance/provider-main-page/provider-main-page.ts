import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProviderService } from 'src/app/services/providerService';
import { ProviderDetails } from './provider-details/provider-details';

@Component({
  selector: 'provider-main-page',
  imports: [ProviderDetails],
  templateUrl: './provider-main-page.html',
})
export class ProviderMainPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  providerService = inject(ProviderService);

  providerId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id'])),
  );

  providersResource = rxResource({
    request: () => ({ id: this.providerId() }),
    loader: ({ request }) => {
      return this.providerService.getProviderById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.providersResource.error()) {
      this.router.navigate(['/admin/providers']);
    }
  });
}
