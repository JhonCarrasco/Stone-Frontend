import { BankAccount, Contact, Location } from './contact.model';
import { Person } from './person.model';

export interface Customer {
  id?: number;
  active?: null;
  createAt?: null;
  updatedAt?: null;

  personId?: number;
  locationId?: number;
  bankAccountId?: number;

  rut: string;
  displayName: string;
  email: string;
  phone: string;
  accountNumber: null;

  person: Person;
  location: Location;
  bankAccount: BankAccount;

  contacts: Contact[] | null;
  typePersonId: number | null;
  businessActivity: null;
  address: null;
  communeId: null;
  regionId: null;
  bankId: null;
  typeAccountId: null;
}
