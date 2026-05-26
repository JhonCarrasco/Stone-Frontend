import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { AuthLayoutComponent } from '@auth/layout/auth-layout/auth-layout.component';
import { LoginPageComponent } from '@auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from '@auth/pages/register-page/register-page.component';

export const routes: Routes = [
  // {
  //   path: '', //auth
  //   loadChildren: () => import('./auth/auth.routes'),
  // canMatch: [
  // () => {
  //   console.log('hola Mundo');
  //   return true;
  // },
  // NotAuthenticatedGuard,
  // ],
  // },

  // {
  //   path: 'admin',
  //   loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./store-front/store-front.routes'),
  // },

  {
    path: '',
    component: LoginPageComponent,
  },

  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'), //pivote a la carga de PagesModule
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: 'pages',
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
