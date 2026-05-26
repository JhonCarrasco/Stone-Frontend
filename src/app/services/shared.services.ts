import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { environment } from 'src/environments/environment';
import { Shared } from '@shared/models/shared.model';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class SharedService {
  private http = inject(HttpClient);

  private sharedsCache = new Map<
    string,
    BaseResponseGeneric<Shared<string>[]>
  >();

  getShareds(
    controllerName: string,
    options: Options,
  ): Observable<BaseResponseGeneric<Shared<string>[]>> {
    const { limit = 0, offset = 0, searchText } = options;
    const key = `${limit}-${offset}-${searchText}`; // 10-0-'<nameService>'
    console.log('getShareds-key-cache', key);
    if (this.sharedsCache.has(key)) {
      return of(this.sharedsCache.get(key)!);
    }

    return this.http
      .get<
        BaseResponseGeneric<Shared<string>[]>
      >(`${baseUrl}/${controllerName}`)
      .pipe(
        tap((resp) => console.log('service.getShareds', resp)),
        tap((resp) => this.sharedsCache.set(key, resp)),
      );
  }
}
