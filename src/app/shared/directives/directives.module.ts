import { FocusDirective } from './focus.directive';
import { NgModule } from '@angular/core';
import { CellTemplateDirective } from './cell-template.directive';
import { ControlFocusDirective } from './control-focus.directive';
import { RegexPatternDirective } from './regex-pattern.directive';
import { RegexPatternDigitDecimalNumberDirective } from './regex-pattern-digit-decimal-number.directive';

const directives = [
  ControlFocusDirective,
  CellTemplateDirective,
  RegexPatternDirective,
  FocusDirective,
  RegexPatternDigitDecimalNumberDirective,
];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DirectivesModule {}
