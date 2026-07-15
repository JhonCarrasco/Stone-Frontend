import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductsAdminPageComponent } from './pages/product/products-admin-page/products-admin-page.component';
import { ProductAdminPageComponent } from './pages/product/product-admin-page/product-admin-page.component';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { BudgetsMainPage } from './pages/budget/budgets-main-page/budgets-main-page';
import { BudgetMainPage } from './pages/budget/budget-main-page/budget-main-page';
import { MaterialsReceptionPage } from './pages/material/materials-reception-page/materials-reception-page';
import { MaterialsDispatchPage } from './pages/material/materials-dispatch-page/materials-dispatch-page';
import { MaterialsVoucherPage } from './pages/material/materials-voucher-page/materials-voucher-page';
import { MaterialReceptionPage } from './pages/material/material-reception-page/material-reception-page';
import { MaterialDispatchPage } from './pages/material/material-dispatch-page/material-dispatch-page';
import { MaterialVoucherPage } from './pages/material/material-voucher-page/material-voucher-page';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminGuard],
    children: [
      {
        path: '',
        component: MaterialsVoucherPage,
      },
      {
        path: 'products',
        component: ProductsAdminPageComponent,
      },
      {
        path: 'products/:id',
        component: ProductAdminPageComponent,
      },
      {
        path: 'budgets',
        component: BudgetsMainPage,
      },
      {
        path: 'budgets/:id',
        component: BudgetMainPage,
      },
      {
        path: 'materials/reception',
        component: MaterialsReceptionPage,
        data: {},
      },
      {
        path: 'materials/reception/:id',
        component: MaterialReceptionPage, //TODO: create material reception page
      },
      {
        path: 'materials/dispatch',
        component: MaterialsDispatchPage,
      },
      {
        path: 'materials/dispatch/:id',
        component: MaterialDispatchPage, //TODO: create material dispatch page
      },
      {
        path: 'materials/voucher',
        component: MaterialsVoucherPage,
      },
      {
        path: 'materials/voucher/:id',
        component: MaterialVoucherPage, //TODO: create material voucher page
      },
      {
        path: '**',
        redirectTo: 'budgets',
      },
    ],
  },
];

export default adminDashboardRoutes;
