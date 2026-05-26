import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { BudgetsMainPage } from './pages/budgets-main-page/budgets-main-page';
import { BudgetMainPage } from './pages/budget-main-page/budget-main-page';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminGuard],
    children: [
      {
        path: '',
        component: ProductsAdminPageComponent,
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
        path: '**',
        redirectTo: 'budgets',
      },
    ],
  },
];

export default adminDashboardRoutes;
