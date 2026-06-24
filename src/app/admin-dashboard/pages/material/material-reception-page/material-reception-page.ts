import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { BudgetService } from 'src/app/services/budgetService';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'material-reception-page',
  imports: [],
  templateUrl: './material-reception-page.html',
})
export class MaterialReceptionPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  materialService = inject(MaterialService);

  materialId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id'])),
  );

  materialsResource = rxResource({
    request: () => ({ id: this.materialId() }),
    loader: ({ request }) => {
      return this.materialService.getMaterialById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.materialsResource.error()) {
      this.router.navigate(['/admin/materials/reception']);
    }
  });
}
