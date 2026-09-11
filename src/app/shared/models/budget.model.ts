import { Customer } from './customer.model';

export interface Budget {
  id: number;
  active: boolean;
  createAt: Date;
  updatedAt?: Date;
  projectName: string;
  address: string;
  description: string;
  material: string;
  subTotal: number;
  neto: number;
  taxRate: number;
  totalValue: number;
  customerId: number;
  displayName?: string;
  email?: string;
  customer: Customer;
  phone: string;
  state: number | null;
  zone: number | null;
  contactPerson?: string;
  phoneContact?: string;
  taxRateTotal: number;
  itemizedProducts: ItemizedProduct[];
  itemizedServices: ItemizedService[];
}

export interface ItemizedProduct {
  id: number;
  active: boolean;
  createAt: null;
  updatedAt: null;
  description: string;
  long: number;
  width: number;
  thickness: number;
  color: string;
  material: string;
  unitValue: number;
  amount: number;
  totalValue: number;
  budgetId: number;
  productId: number;
  unitMeasurement: string | null;
  height: number;
}

export interface ItemizedService {
  id: number;
  active: boolean;
  createAt: null;
  updatedAt: null;
  description: string;
  unitValue: number;
  amount: number;
  totalValue: number;
  budgetId: number;
}
