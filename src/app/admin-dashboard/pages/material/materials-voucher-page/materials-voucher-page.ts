import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchVoucher } from '@shared/components/search-voucher/search-voucher';
import { VoucherTable } from 'src/app/materials/components/voucher-table/voucher-table';
import { MaterialService } from 'src/app/services/materialService';

const uriService = 'materials/vouchers';
@Component({
  selector: 'materials-voucher-page',
  imports: [PaginationComponent, RouterLink, VoucherTable, SearchVoucher],
  templateUrl: './materials-voucher-page.html',
})
export class MaterialsVoucherPage {
  materialService = inject(MaterialService);
  paginationService = inject(PaginationService);
  elementsPerPage = signal(10);
  searchText = signal('');

  vouchersResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.elementsPerPage(),
      searchText: this.searchText(),
      uri: uriService,
    }),
    loader: ({ request }) => {
      return this.materialService.getMaterials({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
        uri: request.uri,
      });
    },
  });

  onSearchVoucherChange(event: string) {
    this.searchText.set(event);
    const itemData$ = this.materialService.getMaterials({
      offset:
        (this.paginationService.currentPage() - 1) * this.elementsPerPage(),
      limit: this.elementsPerPage(),
      searchText: event,
      uri: uriService,
    });

    itemData$.subscribe((response) => {
      this.vouchersResource.set(response);
      // console.log('onSearchVoucherChange', response);
      // this.searchText.set('');
    });
  }
}
