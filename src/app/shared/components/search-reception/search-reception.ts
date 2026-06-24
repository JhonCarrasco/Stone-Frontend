import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'search-reception',
  imports: [],
  templateUrl: './search-reception.html',
})
export class SearchReception {
  searchReceptionText = signal('');
  @Output() receptionEvent = new EventEmitter<string>();

  onSelectionSearchReceptionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchReceptionText.set(value);
  }

  onSearchReceptionBtn() {
    this.receptionEvent.emit(this.searchReceptionText());
  }
}
