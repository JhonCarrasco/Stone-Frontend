import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'search-budget',
  imports: [],
  templateUrl: './search-budget.html',
})
export class SearchBudget {
  searchBudgetText = signal('');
  @Output() budgetEvent = new EventEmitter<string>();

  onSearchBudgetBtn() {
    this.budgetEvent.emit(this.searchBudgetText());
  }

  onSelectionSearchBudgetChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchBudgetText.set(value);
  }
}
