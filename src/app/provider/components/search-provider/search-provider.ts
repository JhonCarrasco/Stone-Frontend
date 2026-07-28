import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { Provider } from '@shared/models/provider.model';

@Component({
  selector: 'search-provider',
  imports: [],
  templateUrl: './search-provider.html',
})
export class SearchProvider {
  withDatalist = input.required<boolean>();
  providersFound = input.required<Provider[]>();
  searchProviderText = signal('');
  @Output() providerEvent = new EventEmitter<string>();

  onSearchProviderBtn() {
    this.providerEvent.emit(this.searchProviderText());
  }
  onSelectionSearchProviderChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchProviderText.set(value);
    // console.log('SearchProvider.onSelectionSearchProviderChange.value', value);

    this.providerEvent.emit(this.searchProviderText());
  }
}
