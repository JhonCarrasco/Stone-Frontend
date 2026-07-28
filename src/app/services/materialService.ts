import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { MaterialGuideGeneric } from '@shared/models/material.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyMaterialGuide: MaterialGuideGeneric = {
  id: 0,
  active: null,
  createAt: new Date(),
  updatedAt: null,
  folio: '',
  documentType: 0,
  observations: '',
  currencyType: 0,
  valueCurrency: 0,
  customer: {
    id: 0,
    active: null,
    createAt: null,
    updatedAt: null,
    rut: '',
    displayName: '',
    email: '',
    phone: '',
    personId: undefined,
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
    locationId: undefined,
    bankAccountId: undefined,
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
    accountNumber: null,
    bankAccount: {
      bankId: null,
      accountNumber: null,
      typeAccountId: null,
      typeAccount: {
        description: null,
        id: null,
        active: null,
        createAt: null,
        updatedAt: null,
      },
      bank: {
        description: null,
        id: null,
        active: null,
        createAt: null,
        updatedAt: null,
      },
      id: 0,
      active: null,
      createAt: null,
      updatedAt: null,
    },
    contacts: null,
    typePersonId: null,
    businessActivity: null,
    address: null,
    communeId: null,
    regionId: null,
    bankId: null,
    typeAccountId: null,
  },
  customerId: null,
  provider: {
    id: 0,
    active: null,
    createAt: null,
    updatedAt: null,
    rut: '',
    displayName: '',
    email: '',
    phone: '',
    personId: undefined,
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
    locationId: undefined,
    bankAccountId: undefined,
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
    accountNumber: null,
    bankAccount: {
      bankId: null,
      accountNumber: null,
      typeAccountId: null,
      typeAccount: {
        description: null,
        id: null,
        active: null,
        createAt: null,
        updatedAt: null,
      },
      bank: {
        description: null,
        id: null,
        active: null,
        createAt: null,
        updatedAt: null,
      },
      id: 0,
      active: null,
      createAt: null,
      updatedAt: null,
    },
    contacts: null,
    typePersonId: null,
    businessActivity: null,
    address: null,
    communeId: null,
    regionId: null,
    bankId: null,
    typeAccountId: null,
  },
  providerId: 0,
  providerRut: null,
  providerName: null,
  neto: 0,
  taxRate: 0,
  totalValue: 0,
  guideDate: new Date(),
  materials: [],
  supplierTo: null,
  projectTo: null,
  budgetId: null,
  file: null,
  address: null,
  zone: null,
  commune: null,
  netoConversion: null,
};

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private http = inject(HttpClient);

  private guidesCache = new Map<
    string,
    BaseResponseGeneric<MaterialGuideGeneric[]>
  >();
  private guideCache = new Map<
    string,
    BaseResponseGeneric<MaterialGuideGeneric>
  >();

  getMaterials(
    options: Options,
  ): Observable<BaseResponseGeneric<MaterialGuideGeneric[]>> {
    const { limit = 10, offset = 0, searchText = '', uri } = options;
    const key = `${uri}-${limit}-${offset}-${searchText}`; // 10-0-''
    // console.log('getBudgets-key-cache', key);
    if (this.guidesCache.has(key)) {
      return of(this.guidesCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<MaterialGuideGeneric[]>>(`${baseUrl}/${uri}`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(
        // tap((resp) => console.log('service.getMaterials', uri, resp)),
        tap((resp) => this.guidesCache.set(key, resp)),
      );
  }

  getMaterialById(
    id: string,
    uri: string,
  ): Observable<BaseResponseGeneric<MaterialGuideGeneric>> {
    if (id === 'new') {
      return of({
        data: emptyMaterialGuide,
      } as BaseResponseGeneric<MaterialGuideGeneric>);
    }

    if (this.guideCache.has(id)) {
      return of(this.guideCache.get(id)!);
    }

    return this.http
      .get<BaseResponseGeneric<MaterialGuideGeneric>>(`${baseUrl}/${uri}/${id}`)
      .pipe(
        tap((obj) => this.guideCache.set(id, obj)),
        // tap((obj) => console.log('service.getMaterialById', obj)),
      );
  }

  updateMaterial(
    id: string,
    obj: Partial<MaterialGuideGeneric>,
    uri: string,
    /* images?: FileList, */
  ): Observable<BaseResponseGeneric<MaterialGuideGeneric>> {
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
      .put<
        BaseResponseGeneric<MaterialGuideGeneric>
      >(`${baseUrl}/${uri}/${id}`, obj)
      .pipe(
        tap((response) => this.updateMaterialCache(id, obj)),
        // tap((response) =>
        //   console.log('service.updateMaterial.response', response, obj),
        // ),
      );
  }

  createMaterial(
    obj: Partial<MaterialGuideGeneric>,
    uri: string,
  ): Observable<BaseResponseGeneric<number>> {
    // console.log('createBudget-service');
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/${uri}`, obj)
      .pipe(
        tap((response) =>
          this.updateMaterialCache(response.data.toString(), obj),
        ),
        tap((response) => console.log('service.createMaterial', response, obj)),
      );
  }

  updateMaterialCache(id: string, obj: Partial<MaterialGuideGeneric>) {
    this.guideCache.set(id, {
      data: { ...obj, id: Number(id) } as MaterialGuideGeneric,
    } as BaseResponseGeneric<MaterialGuideGeneric>);
    this.guidesCache.forEach((listObj) => {
      listObj.data = listObj.data.map((currentObj) =>
        currentObj.id.toString() === id
          ? ({
              ...currentObj,
              ...obj,
              id: currentObj.id,
            } as MaterialGuideGeneric)
          : currentObj,
      );
    });
  }
}
