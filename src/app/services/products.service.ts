import { HttpClient } from '@angular/common/http';
import { inject, Injectable, provideZoneChangeDetection } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
// import { Gender, Product_Old } from '@products/interfaces/product.interface';
import {
  BaseResponseGeneric,
  Options,
} from '@shared/models/baseResponseGeneric.model';
import {
  BaseEntityResponse,
  Product,
  Provider,
} from '@shared/models/product.model';
import {
  delay,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
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
    // const key = `${limit}-${offset}-${searchText}`; // 10-0-''
    // console.log('getProducts-key-cache', key);
    // if (this.productsCache.has(key)) {
    //   return of(this.productsCache.get(key)!);
    // }

    return this.http
      .get<BaseResponseGeneric<Product[]>>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          searchText,
        },
      })
      .pipe(
        tap((resp) => console.log('service.getProducts', resp)),
        // tap((resp) => this.productsCache.set(key, resp)),
      );
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
      .pipe(
        tap((product) => this.productCache.set(id, product)),
        // tap((product) => console.log('service.getProductById', product)),
      );
  }

  updateProduct(
    id: string,
    product: Partial<Product>,
    /* images?: FileList, */
  ): Observable<BaseResponseGeneric<Product>> {
    // if (images) {
    //   const imagesNames = await firstValueFrom(this.uploadImages(id, images));
    //   product.images = imagesNames;
    // }

    // return this.uploadImages(images).pipe(
    //   map((imagesNames) => ({
    //     ...product,
    //     images: [...(product.images ?? []), ...imagesNames],
    //   })),
    //   switchMap((product) =>
    //     this.http.patch<Product>(`${baseUrl}/products/${id}`, product),
    //   ),
    //   tap((product) => this.updateProductCache(id, product)),
    // );
    return this.http
      .put<BaseResponseGeneric<Product>>(`${baseUrl}/products/${id}`, product)
      .pipe(
        tap((response) => this.updateProductCache(id, product)),
        // tap((response) =>
        //   console.log('service.updateProduct', response, product),
        // ),
      );
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
        // tap((response) =>
        //   console.log('service.createProduct', response, product),
        // ),
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

  // !Carga de imágenes
  // uploadImages(images?: FileList): Observable<string[]> {
  //   if (!images) return of([]);

  //   const uploadObservables = Array.from(images).map((image) =>
  //     this.uploadImage(image),
  //   );

  //   return forkJoin(uploadObservables).pipe(
  //     tap((imagesNames) => console.log({ imagesNames })),
  //   );
  // }

  // uploadImage(image: File): Observable<string> {
  //   const formData = new FormData();
  //   formData.append('file', image);

  //   return this.http
  //     .post<{ secureUrl: string }>(`${baseUrl}/files/product`, formData)
  //     .pipe(map((resp) => resp.secureUrl.split('/').pop()!));
  // }
}
