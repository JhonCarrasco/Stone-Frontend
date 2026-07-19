import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchDispatch } from '@shared/components/search-dispatch/search-dispatch';
import { DispatchTable } from 'src/app/materials/components/dispatch-table/dispatch-table';
import { MaterialService } from 'src/app/services/materialService';

const uriService = 'materials/dispatches';
@Component({
  selector: 'materials-dispatch-page',
  imports: [PaginationComponent, RouterLink, DispatchTable, SearchDispatch],
  templateUrl: './materials-dispatch-page.html',
})
export class MaterialsDispatchPage {
  materialService = inject(MaterialService);
  paginationService = inject(PaginationService);
  elementsPerPage = signal(10);
  searchText = signal('');

  dispatchesResource = rxResource({
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

  onSearchDispatchChange(event: string) {
    this.searchText.set(event);
    const productData$ = this.materialService.getMaterials({
      offset:
        (this.paginationService.currentPage() - 1) * this.elementsPerPage(),
      limit: this.elementsPerPage(),
      searchText: event,
      uri: uriService,
    });

    productData$.subscribe((response) => {
      this.dispatchesResource.set(response);
    });
  }
}
