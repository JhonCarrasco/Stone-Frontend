import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';

@Component({
  selector: 'voucher-table',
  imports: [RouterLink],
  templateUrl: './voucher-table.html',
})
export class VoucherTable {
  vouchers = input.required<MaterialGuideGeneric[]>();
}
