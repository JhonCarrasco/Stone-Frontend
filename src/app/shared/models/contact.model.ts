import { Shared } from './shared.model';

export interface BankAccount {
  bankId: null;
  accountNumber: null;
  typeAccountId: null;
  typeAccount: Shared<string> | null;
  bank: Shared<string> | null;
  id: number;
  active: null;
  createAt: null;
  updatedAt: null;
}

export interface Contact {
  id: number;
  active: boolean;
  phone: string;
  email: string;
  displayName: string;
  position: string;
  customerId: number;
  providerId: number | null;
}

export interface Location {
  address: null;
  communeId: null;
  regionId: null;
  commune: Shared<string>;
  region: Shared<string>;
  id: null;
  active: null;
  createAt: null;
  updatedAt: null;
}
