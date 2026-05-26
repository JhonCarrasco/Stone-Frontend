import { Component, EventEmitter, Output, signal } from '@angular/core';
@Component({
  selector: 'search-product',
  imports: [],
  templateUrl: './search-product.html',
})
export class SearchProduct {
  searchProductText = signal('');
  @Output() productEvent = new EventEmitter<string>();

  onSelectionSearchProductChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchProductText.set(value);
  }

  onSearchProductBtn() {
    this.productEvent.emit(this.searchProductText());
  }
}
