import { Component, effect, inject } from '@angular/core';
import { DispatchDetails } from './dispatch-details/dispatch-details';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'material-dispatch-page',
  imports: [DispatchDetails],
  templateUrl: './material-dispatch-page.html',
})
export class MaterialDispatchPage {
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
        'materials/dispatches',
      );
    },
  });

  redirectEffect = effect(() => {
    if (this.materialsResource.error()) {
      this.router.navigate(['/admin/materials/dispatch']);
    }
  });
}
