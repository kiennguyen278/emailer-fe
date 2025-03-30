import { NgModule } from '@angular/core';
import { OptionClassPipe } from './option-class.pipe';
import { OptionLabelPipe } from './option-label.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

const pipes = [
  OptionLabelPipe,
  SafeHtmlPipe,
  OptionClassPipe,
];

@NgModule({
  declarations: pipes,
  exports: pipes
})
export class PipesModule {}
