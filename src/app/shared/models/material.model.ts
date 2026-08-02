import { Customer } from './customer.model';
import { Provider } from './provider.model';

export interface MaterialGuideGeneric {
  id: number;
  active: null;
  createAt: Date;
  updatedAt?: null;
  folio: string;
  documentType: number;
  observations: string;
  currencyType: number;
  valueCurrency: number;
  customer: Customer;
  customerId: null;
  provider: Provider;
  providerId: number;
  providerRut: null;
  providerName: null;
  neto: number;
  taxRate: number;
  totalValue: number;
  guideDate: Date;
  materials: Material[];
  supplierTo: null;
  projectTo: null;
  budgetId: null;
  file: null;
  address: null;
  zone: null;
  commune: null;
  netoConversion: null;
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
