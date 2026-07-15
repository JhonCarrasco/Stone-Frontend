export interface Product {
  id: number;
  active: boolean;
  createAt?: Date;
  updatedAt?: Date;
  description: string;
  productCode: string;
  long?: number;
  width?: number;
  thickness?: number;
  color?: string;
  unitMeasurement?: string;
  unitValue?: number;
  manufacturerName: string;
  categoryName: string | null;
  providerName: string | null;
  manufacturerId?: number;
  categoryId?: number | null;
  providerId?: number | null;
}

// export interface ProductsResponse {
//   count: number;
//   pages: number;
//   products: Product[];
// }

export interface BaseEntityResponse {
  description: string;
  id: number;
  active: boolean;
  createAt: Date;
  updatedAt: null;
}

// export interface Provider {
//   id: number;
//   active: boolean;
//   createAt: Date;
//   updatedAt: null;
//   personId: number;
//   locationId: number;
//   bankAccountId: number;
//   contacts: Contact[];
// }

export interface Contact {
  contactId: number;
  phone: string;
  email: string;
  personId: number;
  rut: string;
  displayName: string;
  businessActivity: string;
  providerId: number;
  providerName: string;
}
