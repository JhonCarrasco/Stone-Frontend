import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';

@Component({
  selector: 'dispatch-table',
  imports: [RouterLink],
  templateUrl: './dispatch-table.html',
})
export class DispatchTable {
  dispatches = input.required<MaterialGuideGeneric[]>();
}
