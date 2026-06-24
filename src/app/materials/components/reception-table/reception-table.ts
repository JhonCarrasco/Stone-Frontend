import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';

@Component({
  selector: 'reception-table',
  imports: [RouterLink],
  templateUrl: './reception-table.html',
})
export class ReceptionTable {
  receptions = input.required<MaterialGuideGeneric[]>();
}
