import { User } from '@auth/interfaces/user.interface';

export interface ProductsResponse_Old {
  count: number;
  pages: number;
  products: Product_Old[];
}

export interface Product_Old {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: string[];
  images: string[];
  user: User;
}

export enum Gender {
  Kid = 'kid',
  Men = 'men',
  Unisex = 'unisex',
  Women = 'women',
}

export enum Size {
  L = 'L',
  M = 'M',
  S = 'S',
  XS = 'XS',
  Xl = 'XL',
  Xs = 'XS',
  Xxl = 'XXL',
}
