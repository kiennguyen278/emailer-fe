import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroAntdModule } from '@shared/zorro-antd.module';
import { AutocompleteComponent } from '@shared/controls/autocomplete/autocomplete.component';
import { DrawPaintComponent } from '@shared/controls/canvas-paint/canvas-draw-paint.component';
import { CheckboxComponent } from '@shared/controls/checkbox/checkbox.component';
import { DateRangePickerComponent } from '@shared/controls/date-range-picker/date-range-picker.component';
import { DatepickerComponent } from '@shared/controls/datepicker/datepicker.component';
import { InputComponent } from '@shared/controls/input/input.component';
import { InputGroupComponent } from '@shared/controls/input-group/input-group.component';
import { InputNumberComponent } from '@shared/controls/input-number/input-number.component';
import { InputPasswordComponent } from '@shared/controls/input-password/input-password.component';
import { InputSearchComponent } from '@shared/controls/input-search/input-search.component';
import { MonthPickerComponent } from '@shared/controls/month-picker/month-picker.component';
import { RadioComponent } from '@shared/controls/radio/radio.component';
import { RadioGroupComponent } from '@shared/controls/radio-group/radio-group.component';
import { RadioGroupConfirmComponent } from '@shared/controls/radio-group-confirm/radio-group-confirm.component';
import { RichtextComponent } from '@shared/controls/richtext/richtext.component';
import { QuillModule } from 'ngx-quill';
import { SelectComponent } from '@shared/controls/select/select.component';
import { TextareaComponent } from '@shared/controls/textarea/textarea.component';
import { TimepickerComponent } from '@shared/controls/timepicker/timepicker.component';
import { YearPickerComponent } from '@shared/controls/year-picker/year-picker.component';
import { SwitchComponent } from '@shared/controls/switch/switch.component';
import { UploadComponent } from '@shared/controls/upload/upload.component';

const components = [
  AutocompleteComponent,
  DrawPaintComponent,
  CheckboxComponent,
  DateRangePickerComponent,
  DatepickerComponent,
  InputComponent,
  InputGroupComponent,
  InputNumberComponent,
  InputPasswordComponent,
  InputSearchComponent,
  MonthPickerComponent,
  RadioComponent,
  RadioGroupComponent,
  RadioGroupConfirmComponent,
  RichtextComponent,
  SelectComponent,
  TextareaComponent,
  TimepickerComponent,
  YearPickerComponent,
  SwitchComponent,
  UploadComponent,
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    TranslateModule,
    QuillModule.forRoot(),
  ],
  declarations: components,
  exports: components
})
export class ControlsModule {}
