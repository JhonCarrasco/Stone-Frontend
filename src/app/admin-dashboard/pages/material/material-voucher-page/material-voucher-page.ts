import { Component, effect, inject } from '@angular/core';
import { VoucherDetails } from './voucher-details/voucher-details';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'material-voucher-page',
  imports: [VoucherDetails],
  templateUrl: './material-voucher-page.html',
})
export class MaterialVoucherPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  materialService = inject(MaterialService);

  materialId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id'])),
  );

  materialsResource = rxResource({
    request: () => ({ id: this.materialId() }),
    loader: ({ request }) => {
      return this.materialService.getMaterialById(
        request.id,
        'materials/vouchers',
      );
    },
  });

  redirectEffect = effect(() => {
    if (this.materialsResource.error()) {
      this.router.navigate(['/admin/materials/voucher']);
    }
  });
}
