import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { Expense } from '@shared/models/expense.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyExpense: Expense = {
  id: 0,
  active: undefined,
  createAt: undefined,
  updatedAt: undefined,
  expenseTypeId: null,
  expenseDate: null,
  employee: null,
  project: null,
  budgetId: null,
  file: null,
  amount: null,
  methodPaymentId: null,
  paymentReceiptId: null,
  billNumber: null,

  description: null,

  vehicle: null,
  registration: null,

  location: null,
};

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private http = inject(HttpClient);

  private financesCache = new Map<string, BaseResponseGeneric<Expense[]>>();
  private financeCache = new Map<string, BaseResponseGeneric<Expense>>();

  getFinances(options: Options): Observable<BaseResponseGeneric<Expense[]>> {
    const { limit = 10, offset = 0, searchText = '' } = options;
    const key = `${limit}-${offset}-${searchText}`; // 10-0-''
    // console.log('getBudgets-key-cache', key);
    if (this.financesCache.has(key)) {
      return of(this.financesCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Expense[]>>(`${baseUrl}/${options.uri}`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(
        // tap((resp) => console.log('service.getFinances', resp)),
        tap((resp) => this.financesCache.set(key, resp)),
      );
  }

  getFinanceById(
    id: string,
    url: string,
  ): Observable<BaseResponseGeneric<Expense>> {
    if (id === 'new') {
      return of({ data: emptyExpense } as BaseResponseGeneric<Expense>);
    }

    if (this.financeCache.has(id)) {
      return of(this.financeCache.get(id)!);
    }

    return this.http
      .get<BaseResponseGeneric<Expense>>(`${baseUrl}/${url}/${id}`)
      .pipe(
        tap((obj) => this.financeCache.set(id, obj)),
        // tap((obj) => console.log('service.getFinanceById', obj)),
      );
  }

  updateFinanceCache(id: string, obj: Partial<Expense>) {
    this.financeCache.set(id, {
      data: { ...obj, id: Number(id) } as Expense,
    } as BaseResponseGeneric<Expense>);
    this.financesCache.forEach((listObj) => {
      listObj.data = listObj.data.map((currentObj) =>
        currentObj.id?.toString() === id
          ? ({
              ...currentObj,
              ...obj,
              id: currentObj.id ?? Number(id),
            } as Expense)
          : currentObj,
      );
    });
  }

  createFinance(
    obj: Partial<Expense>,
    uri: string,
  ): Observable<BaseResponseGeneric<number>> {
    // console.log('createExpense-service');
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/${uri}`, obj)
      .pipe(
        tap((response) =>
          this.updateFinanceCache(response.data.toString(), obj),
        ),
        // tap((response) => console.log('service.createFinance', response, obj)),
      );
  }

  updateFinance(
    id: string,
    obj: Partial<Expense>,
    uri: string,
    /* images?: FileList, */
  ): Observable<BaseResponseGeneric<Expense>> {
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
      .put<BaseResponseGeneric<Expense>>(`${baseUrl}/${uri}/${id}`, obj)
      .pipe(
        tap((response) => this.updateFinanceCache(id, obj)),
        // tap((response) =>
        //   console.log('service.updateFinance.response', response, obj),
        // ),
      );
  }
}
