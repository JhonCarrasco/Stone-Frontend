import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ProviderTable } from 'src/app/provider/components/provider-table/provider-table';
import { SearchProvider } from 'src/app/provider/components/search-provider/search-provider';
import { ProviderService } from 'src/app/services/providerService';

@Component({
  selector: 'providers-main-page',
  imports: [ProviderTable, PaginationComponent, RouterLink, SearchProvider],
  templateUrl: './providers-main-page.html',
})
export class ProvidersMainPage {
  providerService = inject(ProviderService);
  paginationService = inject(PaginationService);
  elementsPerPage = signal(10);
  searchProviderText = signal('');

  onSearchProviderChange(event: string) {
    this.searchProviderText.set(event);
    const productData$ = this.providerService.getProviders({
      offset:
        (this.paginationService.currentPage() - 1) * this.elementsPerPage(),
      limit: this.elementsPerPage(),
      searchText: event,
    });

    productData$.subscribe((response) => {
      this.providersResource.set(response);
      console.log('ProvidersMainPage.onSearchProviderChange', response);
      // this.searchBudgetText.set('');
    });
  }

  providersResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.elementsPerPage(),
      searchText: this.searchProviderText(), //TODO: add search text signal and bind to input from html page
    }),
    loader: ({ request }) => {
      return this.providerService.getProviders({
        offset: request.page * request.limit,
        limit: request.limit,
        searchText: request.searchText,
      });
    },
  });
}
