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
  person: null,
  location: null,
  bankAccount: null,
  contacts: null,
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

  getCustomerById(id: number): Observable<BaseResponseGeneric<Customer>> {
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
}
