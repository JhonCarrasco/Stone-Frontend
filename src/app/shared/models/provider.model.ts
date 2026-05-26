export interface Provider {
  id: number;
  active: boolean;
  createAt?: Date;
  updatedAt?: Date;
  personName: string;
  personId: number;
  locationId: number;
  bankAccountId: number;
  contacts?: null;
}
