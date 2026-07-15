import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';
import { getDocumentTypeDescription } from 'src/app/constant/documentTypeData';

@Component({
  selector: 'dispatch-table',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './dispatch-table.html',
})
export class DispatchTable {
  onDocumentTypeDescription(documentType: number) {
    return getDocumentTypeDescription(documentType);
  }
  dispatches = input.required<MaterialGuideGeneric[]>();
}
