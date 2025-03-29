import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import {
  DATE_FORMAT,
  DATE_SQL_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_FULL_FORMAT,
  DATE_TIME_SQL_FORMAT,
  DATE_REGEX,
  DATE_TIME_REGEX,
  DATE_TIME_NO_SECOND_REGEX
} from '@core/constants';
import { NotificationService } from '@core/services/notification.service';
import { format, isValid, parse } from 'date-fns';

@Directive({
  selector: '[formatDate]'
})
export class FormatDateDirective implements OnInit {
  @Input('formatDate') format: string;
  constructor(
    private el: ElementRef,
    private control: NgControl,
    protected notification: NotificationService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.inputSelector.addEventListener('focus', () => {
        this.inputSelector.maxLength = this.inputSelector.size - 2;
      });
      this.inputSelector.addEventListener('blur', () => {
        const controlValue = this.inputSelector.value?.replace(/[\/: -]/g, '');
        if (controlValue) {
          switch (this.format.toLocaleLowerCase()) {
            case 'dd/mm/yyyy hh:mm:ss':
              const fullDate = `${controlValue.slice(
                0,
                2
              )}/${controlValue.slice(2, 4)}/${controlValue.slice(
                4,
                8
              )} ${controlValue.slice(8, 10)}:${controlValue.slice(
                10,
                12
              )}:${controlValue.slice(12, 14)}`;
              this.formatDate(
                controlValue,
                fullDate,
                DATE_TIME_FULL_FORMAT,
                DATE_TIME_SQL_FORMAT
              );
              break;
            case 'dd/mm/yyyy hh:mm':
              const dateTime = `${controlValue.slice(
                0,
                2
              )}/${controlValue.slice(2, 4)}/${controlValue.slice(
                4,
                8
              )} ${controlValue.slice(8, 10)}:${controlValue.slice(10, 12)}`;
              this.formatDate(
                controlValue,
                dateTime,
                DATE_TIME_FORMAT,
                DATE_TIME_SQL_FORMAT
              );
              break;
            default:
              const date = `${controlValue.slice(0, 2)}/${controlValue.slice(
                2,
                4
              )}/${controlValue.slice(4, 8)}`;
              this.formatDate(controlValue, date, DATE_FORMAT, DATE_SQL_FORMAT);
              break;
          }
        } else {
          this.control.control?.setValue(null);
        }
      });
    }, 0);
  }

  formatDate(
    controlValue: string,
    date: string,
    dateFormat: string,
    sqlFormat: string
  ) {
    if (isValid(parse(date, dateFormat, new Date()))) {

      this.control.control?.setValue(
        // format(parse(date, dateFormat, new Date()), sqlFormat)
      new Date(format(parse(date, dateFormat, new Date()), sqlFormat))
      );
    } else if (!DATE_REGEX.test(controlValue) && dateFormat === DATE_FORMAT) {
      this.notification.open({
        type: 'warning',
        content: 'Ngày không đúng định dạng. Yêu cầu chọn lại ngày'
      });
    } else if (
      !DATE_TIME_NO_SECOND_REGEX.test(controlValue) &&
      dateFormat === DATE_TIME_FORMAT
    ) {
      this.notification.open({
        type: 'warning',
        content: 'Ngày không đúng định dạng. Yêu cầu chọn lại ngày'
      });
    } else if (
      !DATE_TIME_REGEX.test(controlValue) &&
      dateFormat === DATE_TIME_FULL_FORMAT
    ) {
      this.notification.open({
        type: 'warning',
        content: 'Ngày không đúng định dạng. Yêu cầu chọn lại ngày'
      });
    }
  }

  get inputSelector(): HTMLInputElement {
    return this.el.nativeElement.querySelector('input');
  }
}
