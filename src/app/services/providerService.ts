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
const emptyProvider: Provider = {
  id: 0,
  active: null,
  createAt: null,
  updatedAt: null,
  rut: '',
  email: '',
  displayName: '',
  phone: '',
  person: {
    id: 0,
    active: null,
    createAt: null,
    updatedAt: null,
    rut: '',
    email: '',
    displayName: '',
    typePerson: null,
  },
  location: {
    address: null,
    communeId: null,
    regionId: null,
    commune: {
      description: null,
      id: null,
      active: null,
      createAt: null,
      updatedAt: null,
    },
    region: {
      description: null,
      id: null,
      active: null,
      createAt: null,
      updatedAt: null,
    },
    id: null,
    active: null,
    createAt: null,
    updatedAt: null,
  },
  bankAccount: {
    id: 0,
    active: null,
    createAt: null,
    updatedAt: null,
    bankId: null,
    accountNumber: null,
    typeAccountId: null,
    typeAccount: null,
    bank: null,
  },
  accountNumber: null,
  contacts: null,
  typePersonId: null,
  businessActivity: null,
  address: null,
  communeId: null,
  regionId: null,
  bankId: null,
  typeAccountId: null,
};

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
      .get<BaseResponseGeneric<Provider[]>>(`${baseUrl}/providers`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(
        // tap((resp) => console.log('ProviderService..getProviders', resp)),
        tap((resp) => this.providersCache.set(key, resp)),
      );
  }

  getProviderById(id: string): Observable<BaseResponseGeneric<Provider>> {
    if (id === 'new') {
      return of({ data: emptyProvider } as BaseResponseGeneric<Provider>);
    }

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    const key = `${formattedDate}-provider-${id}`; // 20240617-provider-123
    // console.log('getProviderById-key-cache', key);
    if (this.providerCache.has(key)) {
      return of(this.providerCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Provider>>(`${baseUrl}/providers/${id}`)
      .pipe(
        // tap((resp) => console.log('ProviderService.getProviderById', resp)),
        tap((resp) => this.providerCache.set(key, resp)),
      );
  }

  create(obj: Partial<Provider>): Observable<BaseResponseGeneric<number>> {
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/providers`, obj)
      .pipe(
        tap((response) =>
          this.updateProviderCache(response.data.toString(), obj),
        ),
        // tap((response) => console.log('ProviderService.create.response', response, obj)),
      );
  }

  update(
    id: string,
    obj: Partial<Provider>,
    /* images?: FileList, */
  ): Observable<BaseResponseGeneric<Provider>> {
    // if (images) {
    //   const imagesNames = await firstValueFrom(this.uploadImages(id, images));
    //   product.images = imagesNames;
    // }

    // return this.uploadImages(images).pipe(
    //   map((imagesNames) => ({
    //     ...product,
    //     images: [...(product.images ?? []), ...imagesNames],
    //   })),
    //   switchMap((product) =>
    //     this.http.patch<Budget>(`${baseUrl}/products/${id}`, product),
    //   ),
    //   tap((product) => this.updateBudgetCache(id, product)),
    // );
    return this.http
      .put<BaseResponseGeneric<Provider>>(`${baseUrl}/providers/${id}`, obj)
      .pipe(
        tap((response) => this.updateProviderCache(id, obj)),
        // tap((response) =>
        //   console.log('ProviderService.update.response', response, obj),
        // ),
      );
  }

  updateProviderCache(id: string, obj: Partial<Provider>) {
    this.providerCache.set(id, {
      data: { ...obj, id: Number(id) } as Provider,
    } as BaseResponseGeneric<Provider>);
    this.providersCache.forEach((listObj) => {
      listObj.data = listObj.data.map((currentObj) =>
        currentObj.id?.toString() === id
          ? ({
              ...currentObj,
              ...obj,
              id: currentObj.id,
            } as Provider)
          : currentObj,
      );
    });
  }
}
