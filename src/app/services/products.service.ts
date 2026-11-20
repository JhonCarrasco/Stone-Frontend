import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import { Product } from '@shared/models/product.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyProduct: Product = {
  id: 0,
  active: true,
  createAt: new Date(),
  updatedAt: undefined,
  description: '',
  productCode: '',
  long: 0,
  width: 0,
  thickness: 0,
  color: '',
  unitMeasurement: '',
  unitValue: 0,
  manufacturerName: '',
  categoryName: '',
  providerName: '',
  manufacturerId: 0,
  categoryId: 0,
  providerId: 0,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, BaseResponseGeneric<Product[]>>();
  private productCache = new Map<string, BaseResponseGeneric<Product>>();

  getProducts(options: Options): Observable<BaseResponseGeneric<Product[]>> {
    const { limit = 10, offset = 0, searchText = '' } = options;
    const key = `${limit}-${offset}-${searchText}`; // 10-0-''
    // console.log('getProducts-key-cache', key);
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<BaseResponseGeneric<Product[]>>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  getProductById(id: string): Observable<BaseResponseGeneric<Product>> {
    if (id === 'new') {
      return of({ data: emptyProduct } as BaseResponseGeneric<Product>);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http
      .get<BaseResponseGeneric<Product>>(`${baseUrl}/products/${id}`)
      .pipe(tap((product) => this.productCache.set(id, product)));
  }

  updateProduct(
    id: string,
    product: Partial<Product>,
  ): Observable<BaseResponseGeneric<Product>> {
    return this.http
      .put<BaseResponseGeneric<Product>>(`${baseUrl}/products/${id}`, product)
      .pipe(tap((response) => this.updateProductCache(id, product)));
  }

  createProduct(
    product: Partial<Product>,
  ): Observable<BaseResponseGeneric<number>> {
    // console.log('createProduct-service');
    return this.http
      .post<BaseResponseGeneric<number>>(`${baseUrl}/products`, product)
      .pipe(
        tap((response) =>
          this.updateProductCache(response.data.toString(), product),
        ),
      );
  }

  updateProductCache(id: string, product: Partial<Product>) {
    this.productCache.set(id, {
      data: { ...product, id: Number(id) } as Product,
    } as BaseResponseGeneric<Product>);
    this.productsCache.forEach((products) => {
      products.data = products.data.map((currentProduct) =>
        currentProduct.id.toString() === id
          ? ({
              ...currentProduct,
              ...product,
              id: currentProduct.id,
            } as Product)
          : currentProduct,
      );
    });
  }
}
