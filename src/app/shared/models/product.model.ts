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

export interface BaseEntityResponse {
  description: string;
  id: number;
  active: boolean;
  createAt: Date;
  updatedAt: null;
}
