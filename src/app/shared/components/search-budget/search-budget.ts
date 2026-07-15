import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Budget } from '@shared/models/budget.model';
import { MaterialGuideGeneric } from '@shared/models/material.model';

// interface objOutput {
//   searchText: string;
//   projectName: string;
// }
@Component({
  selector: 'search-budget',
  imports: [],
  templateUrl: './search-budget.html',
})
export class SearchBudget {
  withDatalist = input.required<boolean>();
  budgetsFound = input.required<Budget[]>();
  searchBudgetText = signal('');
  // outputInterface = signal<objOutput>({ searchText: '', projectName: '' });

  @Output() budgetEvent = new EventEmitter<string>();

  onSearchBudgetBtn() {
    this.budgetEvent.emit(this.searchBudgetText());
  }

  onSelectionSearchBudgetChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.searchBudgetText.set(value);
    // console.log('SearchBudget.onSelectionSearchBudgetChange.value', value);
    //TODO: retornar valor projectName para asignarlo al input projectTo
    this.budgetEvent.emit(this.searchBudgetText());
  }
}
