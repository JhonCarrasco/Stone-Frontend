import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { Expense } from '@shared/models/expense.model';
import { Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DriveService } from './driveService';
import { FileDrive, FileRequest } from '@shared/models/fileDrive.model';
import { documentType } from '../constant/documentTypeData';

const baseUrl = environment.baseUrl;

const emptyExpense: Expense = {
  id: 0,
  active: undefined,
  createAt: undefined,
  updatedAt: undefined,
  documentType: 0,
  expenseTypeId: null,
  expenseDate: null,
  employee: null,
  project: null,
  budgetId: null,
  files: [],
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
  private driveService = inject(DriveService);

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
    fileList?: File[],
  ): Observable<BaseResponseGeneric<number>> {
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/${uri}`, obj)
      .pipe(
        // tap((response) =>
        //   this.updateFinanceCache(response.data.toString(), obj),
        // ),
        switchMap((x) => {
          const requestDrive: FileRequest = {
            folderId: null,
            documentId: Number(x.data), // ID del documento recién creado
            documentType: obj.documentType ?? 0,
            files: fileList,
          };
          return this.driveService.upload(requestDrive).pipe(
            tap((response) =>
              console.log(
                'ExpenseService.createFinance.responseDrive',
                response,
              ),
            ),
            switchMap(() => of(x)),
          );
        }),
      );
  }

  updateFinance(
    id: string,
    obj: Partial<Expense>,
    uri: string,
    fileList?: File[],
  ): Observable<BaseResponseGeneric<FileDrive[]>> {
    return this.http
      .put<BaseResponseGeneric<FileDrive[]>>(`${baseUrl}/${uri}/${id}`, obj)
      .pipe(
        // tap((response) => this.updateFinanceCache(id, obj)),
        // tap((responseFinance) =>
        //   console.log('service.updateFinance.response', responseFinance),
        // ),
        switchMap((x) => {
          fileList = fileList?.filter((file) => {
            // Quitar copias representativas del listado de archivos que ya existen en obj.files
            const existingFile = obj.files?.find(
              (f) => f.fileName === file.name,
            );
            return !existingFile; // Keep the file if it doesn't exist in obj.files
          });

          if (fileList && fileList?.length > 0) {
            const requestDrive: FileRequest = {
              folderId: obj.files?.[0]?.folderParentId ?? null,
              documentId: Number(x.data), // ID del documento recién creado
              documentType: 9, // ID documentTypeData
              files: fileList,
            };
            return this.driveService
              .upload(requestDrive)
              .pipe(tap((resp) => of(resp)));
          }
          return of(x);
        }),
      );
  }
}
