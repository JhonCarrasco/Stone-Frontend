import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { User } from '@auth/interfaces/user.interface';
import { LoginApiResponse } from '@shared/models/auth.model';
import { BaseResponseGeneric } from '@shared/models/baseResponseGeneric.model';
import { decodeToken } from 'src/app/utils/token-utils';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _expirationDate = signal<Date | null>(null);

  private http = inject(HttpClient);
  private router = inject(Router);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  expirationDate = computed(this._expirationDate);
  isAdmin = computed(
    () => this.user()?.roles.includes('Administrator') ?? false,
  );

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<BaseResponseGeneric<LoginApiResponse>>(`${baseUrl}/users/Login`, {
        username: email,
        password: password,
      })
      .pipe(
        map((resp: BaseResponseGeneric<LoginApiResponse>) => {
          if (!resp.success) {
            return resp.success;
          }
          return this.handleAuthSuccess(resp.data);
        }),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token || new Date() > this._expirationDate()!) {
      this.logout();
      return of(false);
    }

    const claims = decodeToken(token);

    return this.http
      .get<BaseResponseGeneric<LoginApiResponse>>(
        `${baseUrl}/users/CheckAuthStatus/${claims.id}`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        },
      )
      .pipe(
        map((resp) => this.handleAuthSuccess(resp.data)),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._expirationDate.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  private handleAuthSuccess({ token, user, expirationDate }: LoginApiResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    this._expirationDate.set(new Date(expirationDate));

    localStorage.setItem('token', token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
