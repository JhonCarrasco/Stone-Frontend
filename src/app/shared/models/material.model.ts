import { Customer } from './customer.model';
import { Provider } from './provider.model';

export interface MaterialGuideGeneric {
  id: number;
  active: null;
  createAt: null;
  updatedAt?: null;
  folio: string;
  documentType: number;
  observations: string;
  currencyType: number;
  valueCurrency: null;
  customer: Customer;
  customerId: number;
  provider: Provider;
  providerId: number;
  neto: number;
  taxRate: number;
  totalValue: number;
  guideDate: Date;
  materials: Material[];
  supplierTo: null;
  projectTo: null;
  budgetId: null;
  file: null;
  locationId: null;
  address: null;
  zone: null;
}

export interface Material {
  productCode: string;
  description: string;
  unitMeasurement: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  productId: null;
  voucherId: null;
  receptionId: number;
  dispatchId: null;
  id: number;
  active: boolean;
  createAt: null;
  updatedAt: null;
}
