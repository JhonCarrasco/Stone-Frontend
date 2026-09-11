import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'search-expense',
  imports: [],
  templateUrl: './search-expense.html',
})
export class SearchExpense {
  searchExpenseText = signal('');
  @Output() expenseEvent = new EventEmitter<string>();

  onSelectionSearchExpenseChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchExpenseText.set(value);
  }

  onSearchExpenseBtn() {
    this.expenseEvent.emit(this.searchExpenseText());
  }
}
