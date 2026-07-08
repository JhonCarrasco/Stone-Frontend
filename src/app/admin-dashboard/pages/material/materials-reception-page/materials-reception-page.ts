import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchReception } from '@shared/components/search-reception/search-reception';
import { ReceptionTable } from 'src/app/materials/components/reception-table/reception-table';
import { MaterialService } from 'src/app/services/materialService';

const uriService = 'materials/receptions';
@Component({
  selector: 'materials-reception-page',
  imports: [PaginationComponent, RouterLink, ReceptionTable, SearchReception],
  templateUrl: './materials-reception-page.html',
})
export class MaterialsReceptionPage {
  materialService = inject(MaterialService);
  paginationService = inject(PaginationService);
  activatedRoute = inject(ActivatedRoute);
  elementsPerPage = signal(10);
  searchText = signal('');
  // modulePath = signal('');

  // ngOnInit(): void {
  //   this.activatedRoute.url.subscribe((resp) => {
  //     console.log('MaterialsReceptionPage.ngOnInit.modulePath', resp[1].path);
  //     switch (resp[1].path) {
  //       case 'reception':
  //         this.modulePath.set('reception');
  //         break;
  //       case 'dispatch':
  //         this.modulePath.set('dispatch');
  //         break;
  //       case 'voucher':
  //         this.modulePath.set('voucher');
  //         break;
  //     }
  //   }); // UrlSegment[]
  // }

  receptionsResource = rxResource({
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

  onSearchReceptionChange(event: string) {
    this.searchText.set(event);
    const productData$ = this.materialService.getMaterials({
      offset:
        (this.paginationService.currentPage() - 1) * this.elementsPerPage(),
      limit: this.elementsPerPage(),
      searchText: event,
      uri: uriService,
    });

    productData$.subscribe((response) => {
      this.receptionsResource.set(response);
      // console.log('onSearchReceptionChange', response);
      // this.searchText.set('');
    });
  }
}
