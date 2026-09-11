import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { Product } from '@shared/models/product.model';
@Component({
  selector: 'search-product',
  imports: [],
  templateUrl: './search-product.html',
})
export class SearchProduct {
  withDatalist = input.required<boolean>();
  productsFound = input.required<Product[]>();
  searchProductText = signal('');
  @Output() productEvent = new EventEmitter<string>();

  onSelectionSearchProductChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const searchSplit = value.split('-');
    const splitText = searchSplit.length > 1 ? searchSplit[1] : searchSplit[0];
    const findText = splitText.replace('-', '').trim();
    this.searchProductText.set(findText);
    this.productEvent.emit(this.searchProductText());
  }

  onSearchProductBtn() {
    this.productEvent.emit(this.searchProductText());
  }
}
