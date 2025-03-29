import { FocusDirective } from './focus.directive';
import { InputRestrictionDirective } from './input-restriction.directive';
import { NgModule } from '@angular/core';
import { ButtonSubmitFormDirective } from './button-submit-form.directive';
import { CellTemplateDirective } from './cell-template.directive';
import { ControlFocusDirective } from './control-focus.directive';
import { CurrencyInputDirective } from './currency-input.directive';
import { FormatDateDirective } from './format-date.directive';
import { FormatNameDirective } from './format-name.directive';
import { RegexPatternDirective } from './regex-pattern.directive';
import { FormAutoFocus } from '@shared/directives/focus-first-invalid-input.directive';
import { NoSpaceTextDirective } from '@shared/directives/text-no-space.directive';
import { NumberOnlyDirective } from './numbers-only.directive';
import { AppSelectUpdatePositionDirective } from './update-position-select.directive';
import {TrimSpaceInputDirective} from "@shared/directives/trim-space-input.directive";
import { RegexPatternDigitDecimalNumberDirective } from './regex-pattern-digit-decimal-number.directive';
import { PreventDoubleClickDirective } from './prenvent-double-click.directive';
import {HasPermissionDirective} from "@shared/directives/has-permission.directive";
import { UppercaseDirective } from '@shared/directives/uppercase.directive';
import { HasRoleDirective } from '@shared/directives/has-role.directive';

const directives = [
  ControlFocusDirective,
  CellTemplateDirective,
  ButtonSubmitFormDirective,
  RegexPatternDirective,
  FormatDateDirective,
  FormatNameDirective,
  CurrencyInputDirective,
  FormAutoFocus,
  NoSpaceTextDirective,
  NumberOnlyDirective,
  AppSelectUpdatePositionDirective,
  InputRestrictionDirective,
  FocusDirective,
  TrimSpaceInputDirective,
  RegexPatternDigitDecimalNumberDirective,
  // AppDatePickerScrollDirective,
  PreventDoubleClickDirective,
  HasPermissionDirective,
  UppercaseDirective,
  HasRoleDirective,
];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DirectivesModule {}
