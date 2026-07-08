import {
  Component,
  OnDestroy,
  signal,
  inject,
  Input,
  input,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  DateFilterFn,
  MatCalendar,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/** @title Datepicker with custom calendar header */
@Component({
  selector: 'calendar-datepicker',
  templateUrl: './calendar-datepicker.html',
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
})
export class CalendarDatepicker implements OnInit {
  onDateChange(event: Date) {
    // console.log('CalendarDatepicker.onDateChange', event);
    this.guideDateEvent.emit(event);
  }

  readonly Header = Header;
  dateInput = input.required<Date>();
  @Output() guideDateEvent = new EventEmitter<Date>();

  ngOnInit(): void {
    // console.log('CalendarDatepicker.ngOnInit.dateInput', this.dateInput());
    this.guideDateEvent.emit(this.dateInput());
  }
}

/** Custom header component for datepicker. */
@Component({
  selector: 'header',
  styles: `
    .header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }
  `,
  template: `
    <div class="header">
      <button matIconButton (click)="previousClicked('year')">
        <mat-icon>keyboard_double_arrow_left</mat-icon>
      </button>
      <button matIconButton (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="header-label">{{ periodLabel() }}</span>
      <button matIconButton (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
      <button matIconButton (click)="nextClicked('year')">
        <mat-icon>keyboard_double_arrow_right</mat-icon>
      </button>
    </div>
  `,
  imports: [MatButtonModule, MatIconModule],
})
export class Header<D> implements OnDestroy {
  private _calendar = inject<MatCalendar<D>>(MatCalendar);
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private _dateFormats = inject(MAT_DATE_FORMATS);

  private _destroyed = new Subject<void>();

  readonly periodLabel = signal('');

  constructor() {
    this._calendar.stateChanges
      .pipe(startWith(null), takeUntil(this._destroyed))
      .subscribe(() => {
        this.periodLabel.set(
          this._dateAdapter
            .format(
              this._calendar.activeDate,
              this._dateFormats.display.monthYearLabel,
            )
            .toLocaleUpperCase(),
        );
      });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}
