import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { Provider } from '@shared/models/provider.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private http = inject(HttpClient);

  private providersCache = new Map<string, BaseResponseGeneric<Provider[]>>();
  private providerCache = new Map<string, BaseResponseGeneric<Provider>>();

  getProviders(options: Options): Observable<BaseResponseGeneric<Provider[]>> {
    const { limit = 0, offset = 0, searchText = 'providers' } = options;
    const key = `${limit}-${offset}-${searchText}`; // 0-0-'providers' //valor inicial
    // console.log('getProviders-key-cache', key);
    if (this.providersCache.has(key)) {
      return of(this.providersCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Provider[]>>(
        `${baseUrl}/providers`,
        /* , {
        params: {
          limit,
          offset,
          searchText,
        },
      } */
      )
      .pipe(
        // tap((resp) => console.log('service.getProviders', resp)),
        tap((resp) => this.providersCache.set(key, resp)),
      );
  }
}
