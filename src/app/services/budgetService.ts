import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { Budget } from '@shared/models/budget.model';
import { Customer } from '@shared/models/customer.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyBudget: Budget = {
  id: 0,
  active: true,
  createAt: new Date(),
  updatedAt: undefined,
  projectName: '',
  address: '',
  description: '',
  material: '',
  subTotal: 0,
  neto: 0,
  taxRate: 0,
  totalValue: 0,
  customerId: 0,
  phone: '',
  state: null,
  zone: null,
  taxRateTotal: 0,
  customer: {} as Customer,
  itemizedProducts: [],
  itemizedServices: [],
};

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private http = inject(HttpClient);

  private budgetsCache = new Map<string, BaseResponseGeneric<Budget[]>>();
  private budgetCache = new Map<string, BaseResponseGeneric<Budget>>();

  getBudgets(options: Options): Observable<BaseResponseGeneric<Budget[]>> {
    const { limit = 10, offset = 0, searchText = '' } = options;
    const key = `${limit}-${offset}-${searchText}`; // 10-0-''
    // console.log('getBudgets-key-cache', key);
    if (this.budgetsCache.has(key)) {
      return of(this.budgetsCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Budget[]>>(`${baseUrl}/budgets`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(
        // tap((resp) => console.log('service.getBudgets', resp)),
        tap((resp) => this.budgetsCache.set(key, resp)),
      );
  }

  getBudgetById(id: string): Observable<BaseResponseGeneric<Budget>> {
    if (id === 'new') {
      return of({ data: emptyBudget } as BaseResponseGeneric<Budget>);
    }

    if (this.budgetCache.has(id)) {
      return of(this.budgetCache.get(id)!);
    }

    return this.http
      .get<BaseResponseGeneric<Budget>>(`${baseUrl}/budgets/${id}`)
      .pipe(
        tap((obj) => this.budgetCache.set(id, obj)),
        // tap((obj) => console.log('service.getBudgetById', obj)),
      );
  }

  updateBudget(
    id: string,
    obj: Partial<Budget>,
    /* images?: FileList, */
  ): Observable<BaseResponseGeneric<Budget>> {
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
      .put<BaseResponseGeneric<Budget>>(`${baseUrl}/budgets/${id}`, obj)
      .pipe(
        tap((response) => this.updateBudgetCache(id, obj)),
        // tap((response) =>
        //   console.log('service.updateBudget.response', response, obj),
        // ),
      );
  }

  createBudget(obj: Partial<Budget>): Observable<BaseResponseGeneric<number>> {
    // console.log('createBudget-service');
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/budgets`, obj)
      .pipe(
        tap((response) =>
          this.updateBudgetCache(response.data.toString(), obj),
        ),
        // tap((response) => console.log('service.createBudget', response, obj)),
      );
  }

  updateBudgetCache(id: string, obj: Partial<Budget>) {
    this.budgetCache.set(id, {
      data: { ...obj, id: Number(id) } as Budget,
    } as BaseResponseGeneric<Budget>);
    this.budgetsCache.forEach((listObj) => {
      listObj.data = listObj.data.map((currentObj) =>
        currentObj.id.toString() === id
          ? ({
              ...currentObj,
              ...obj,
              id: currentObj.id,
            } as Budget)
          : currentObj,
      );
    });
  }
}
