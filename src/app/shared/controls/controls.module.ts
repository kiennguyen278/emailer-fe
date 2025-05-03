import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroAntdModule } from '@shared/zorro-antd.module';
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
import { SwitchComponent } from '@shared/controls/switch/switch.component';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {RichtextEmailComponent} from "@shared/controls/richtext-email/richtext-email.component";
import {RichtextTinymceComponent} from "@shared/controls/richtext-tinymce/richtext-tinymce.component";

const components = [
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
  RichtextEmailComponent,
  RichtextTinymceComponent,
  SelectComponent,
  TextareaComponent,
  SwitchComponent,
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    TranslateModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    EditorModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class ControlsModule {}
