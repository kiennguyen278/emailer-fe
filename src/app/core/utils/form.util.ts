import { FormArray, FormGroup } from '@angular/forms';

export class InvalidFormError extends Error {}

export class FormUtil {
  static validate(form: FormGroup, recursive = false) {
    for (const key in form.controls) {
      form.controls[key].markAsDirty();
      form.controls[key].updateValueAndValidity();
      if (form.controls[key] instanceof FormGroup) {
        FormUtil.validate(form.controls[key] as FormGroup, true);
      } else if (form.controls[key] instanceof FormArray) {
        const formArray = (form.controls[key] as FormArray).controls;
        for (const iterator of formArray) {
          FormUtil.validate(iterator as FormGroup, true);
        }
      }
    }
    if (form.invalid && !recursive) {
      throw new InvalidFormError();
    }
  }
}
