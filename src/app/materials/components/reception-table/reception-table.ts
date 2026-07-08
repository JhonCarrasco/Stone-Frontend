import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';
import { getDocumentTypeDescription } from 'src/app/constant/documentTypeData';

@Component({
  selector: 'reception-table',
  imports: [RouterLink],
  templateUrl: './reception-table.html',
})
export class ReceptionTable {
  onDocumentTypeDescription(documentType: number) {
    return getDocumentTypeDescription(documentType);
  }
  receptions = input.required<MaterialGuideGeneric[]>();
}
