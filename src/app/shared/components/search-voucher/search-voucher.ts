import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'search-voucher',
  imports: [],
  templateUrl: './search-voucher.html',
})
export class SearchVoucher {
  searchVoucherText = signal('');
  @Output() voucherEvent = new EventEmitter<string>();

  onSelectionSearchVoucherChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchVoucherText.set(value);
  }

  onSearchVoucherBtn() {
    this.voucherEvent.emit(this.searchVoucherText());
  }
}
