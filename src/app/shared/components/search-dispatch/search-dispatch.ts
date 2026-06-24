import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'search-dispatch',
  imports: [],
  templateUrl: './search-dispatch.html',
})
export class SearchDispatch {
  searchDispatchText = signal('');
  @Output() dispatchEvent = new EventEmitter<string>();

  onSelectionSearchDispatchChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchDispatchText.set(value);
  }

  onSearchDispatchBtn() {
    this.dispatchEvent.emit(this.searchDispatchText());
  }
}
