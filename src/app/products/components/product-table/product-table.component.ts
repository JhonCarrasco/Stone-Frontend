import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'product-table',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  products = input.required<Product[]>();
}
