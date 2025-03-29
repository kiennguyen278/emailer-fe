import { Directive, ElementRef, OnInit, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { DestroyService } from '@core/services';
import { isEqual } from 'lodash';
import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[btnDisable]',
  providers: [DestroyService]
})
export class ButtonSubmitFormDirective implements OnInit {
  constructor(
    @Optional() private formGroup: FormGroupDirective,
    private elementRef: ElementRef<HTMLButtonElement>,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    if (this.formGroup) {
      combineLatest([
        this.formGroup.form.valueChanges.pipe(first()),
        this.formGroup.form.valueChanges
      ])
        .pipe(takeUntil(this.destroy$))
        .subscribe(([original, newValue]) => {
          this.elementRef.nativeElement.disabled = isEqual(original, newValue);
        });
    }
  }
}
