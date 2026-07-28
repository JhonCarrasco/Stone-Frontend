import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { Customer } from '@shared/models/customer.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyCustomer: Customer = {
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
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);

  private customersCache = new Map<string, BaseResponseGeneric<Customer[]>>();
  private customerCache = new Map<string, BaseResponseGeneric<Customer>>();

  getCustomerByNameOrRut(
    options: Options,
  ): Observable<BaseResponseGeneric<Customer[]>> {
    const { limit = 10, offset = 0, searchText = '' } = options;
    const key = `${limit}-${offset}-${searchText}`; // 10-0-''
    // console.log('getCustomers-key-cache', key);
    if (this.customersCache.has(key)) {
      return of(this.customersCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Customer[]>>(`${baseUrl}/customers`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(
        // tap((resp) => console.log('service.getCustomerByNameOrRut', resp)),
        tap((resp) => this.customersCache.set(key, resp)),
      );
  }

  getCustomerById(id: string): Observable<BaseResponseGeneric<Customer>> {
    if (id === 'new') {
      return of({ data: emptyCustomer } as BaseResponseGeneric<Customer>);
    }

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    const key = `${formattedDate}-customer-${id}`; // 20240617-customer-123
    // console.log('getCustomerById-key-cache', key);

    if (this.customerCache.has(key)) {
      return of(this.customerCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Customer>>(`${baseUrl}/customers/${id}`)
      .pipe(
        // tap((resp) => console.log('service.getCustomerByNameOrRut', resp)),
        tap((resp) => this.customerCache.set(key, resp)),
      );
  }

  create(obj: Partial<Customer>): Observable<BaseResponseGeneric<number>> {
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/customers`, obj)
      .pipe(
        tap((response) =>
          this.updateCustomerCache(response.data.toString(), obj),
        ),
        // tap((response) => console.log('CustomerService.create.response', response, obj)),
      );
  }

  update(
    id: string,
    obj: Partial<Customer>,
    /* images?: FileList, */
  ): Observable<BaseResponseGeneric<Customer>> {
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
      .put<BaseResponseGeneric<Customer>>(`${baseUrl}/customers/${id}`, obj)
      .pipe(
        tap((response) => this.updateCustomerCache(id, obj)),
        // tap((response) =>
        //   console.log('CustomerService.update.response', response, obj),
        // ),
      );
  }

  updateCustomerCache(id: string, obj: Partial<Customer>) {
    this.customerCache.set(id, {
      data: { ...obj, id: Number(id) } as Customer,
    } as BaseResponseGeneric<Customer>);
    this.customersCache.forEach((listObj) => {
      listObj.data = listObj.data.map((currentObj) =>
        currentObj.id?.toString() === id
          ? ({
              ...currentObj,
              ...obj,
              id: currentObj.id,
            } as Customer)
          : currentObj,
      );
    });
  }
}
