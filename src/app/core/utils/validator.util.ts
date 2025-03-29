import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import {
  DATE_REGEX,
  EMAIL_REGEX,
  EXCLUDE_SPECIAL_CHARACTERS,
  IDENTITY_CARD_REGEX,
  PHONE_REGEX_VALIDATE
} from '@core/constants';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function isEmptyInputValue(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  return (
    value == null ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
  );
}

function hasValidLength(value: any): boolean {
  return value != null && typeof value.length === 'number';
}

export class ValidatorUtil {
  static min(min: number, message?: string): ValidatorFn {
    return messageValidator(
      minValidator(min),
      message || `Vui lòng nhập số lớn hơn hoặc bằng ${min}`
    );
  }

  static minLess(min: number, message?: string): ValidatorFn {
    return messageValidator(
      minValidatorLess(min),
      message || `Vui lòng nhập số lớn hơn ${min}`
    );
  }

  static max(max: number, message?: string): ValidatorFn {
    return messageValidator(
      maxValidator(max),
      message || `Vui lòng nhập số nhỏ hơn hoặc bằng ${max}`
    );
  }

  static required(message?: string): ValidatorFn {
    return messageValidator(
      requiredValidator,
      message || 'Vui lòng nhập đầy đủ thông tin'
    );
  }

  static requiredTrue(message?: string): ValidatorFn {
    return messageValidator(requiredTrueValidator, message);
  }

  static requiredQty(message?: string): ValidatorFn {
    return messageValidator(requiredQtyValidator, message);
  }

  static email(message?: string): ValidatorFn {
    return messageValidator(
      emailValidator,
      message || 'Vui lòng nhập đúng định dạng email'
    );
  }

  static phone(message?: string): ValidatorFn {
    return messageValidator(
      phoneValidator,
      message || 'Vui lòng nhập đúng định dạng số điện thoại'
    );
  }

  static character(message?: string): ValidatorFn {
    return messageValidator(
      characterValidator,
      message || 'Chuỗi không được bao gồm kí tự đặc biệt'
    );
  }

  static identityCard(message?: string): ValidatorFn {
    return messageValidator(
      identityValidator,
      message || 'Vui lòng nhập đúng định dạng CMND/CCCD/HC'
    );
  }

  static minLength(minLength: number, message?: string): ValidatorFn {
    return messageValidator(
      minLengthValidator(minLength),
      message || `Vui lòng nhập tối thiểu ${minLength} ký tự`
    );
  }

  static insuranceCardIsExpires(isExpired: any, message?: string): ValidatorFn {
    return messageValidator(
      expiresValidator(isExpired),
      message || `Thẻ hết giá trị sử dụng`
    );
  }

  //Thông báo "từ ngày > đến ngày"
  static insuranceToDateIllegal(message?: string): ValidatorFn {
    return messageValidator(insuranceToDateIllegalValidator(), message);
  }

  static isNotVietnamese(isNotVietnamese: any, message?: string): ValidatorFn {
    return messageValidator(
      isVietnameseValidator(isNotVietnamese),
      message || `Dữ liệu nhập không đúng định dạng`
    );
  }

  static maxLength(maxLength: number, message?: string): ValidatorFn {
    return messageValidator(
      maxLengthValidator(maxLength),
      message || `Vui lòng nhập tối đa ${maxLength} ký tự`
    );
  }

  static maxLengthUnicode(maxLength: number, message?: string): ValidatorFn {
    return messageValidator(
      maxLengthUnicodeValidator(maxLength),
      message || `Vui lòng nhập tối đa ${maxLength} ký tự`
    );
  }

  static date(message?: string): ValidatorFn {
    return messageValidator(
      dateValidator,
      message || `Vui lòng nhập đúng định dạng ngày`
    );
  }

  static patternAllow(pattern: string | RegExp, message?: string): ValidatorFn {
    return messageValidator(patternAllowValidator(pattern), message);
  }

  static patternReject(pattern: string | RegExp, message?: string): ValidatorFn {
    return messageValidator(patternRejectValidator(pattern), message);
  }

  static nullValidator(message?: string): ValidationErrors | null {
    return messageValidator(nullValidator, message);
  }

  // static compose(validators: null): null;
  // static compose(
  //   validators: (ValidatorFn | null | undefined)[]
  // ): ValidatorFn | null;
  // static compose(
  //   validators: (ValidatorFn | null | undefined)[] | null
  // ): ValidatorFn | null {
  //   return compose(validators);
  // }
  //
  // static composeAsync(
  //   validators: (AsyncValidatorFn | null)[]
  // ): AsyncValidatorFn | null {
  //   return composeAsync(validators);
  // }

}


export const matchingValidator = (input: string, confirmInput: string, msgErr?: string): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const password: string = control.get(input)?.value || '';
  const confirmPassword: string = control.get(confirmInput)?.value || '';

  const errPassword = control.get(input)?.errors;
  const errconfirmPassword = control.get(confirmInput)?.errors;

  if (!password || !confirmPassword || errPassword || errconfirmPassword) {
    return null;
  } else {
    if (password === confirmPassword){
      return null
    } else {
      return { notmatched: true, message: msgErr || 'Mật khẩu và xác nhận mật khẩu không khớp' };
    }
  }
}

export const notAllowMatchValidator = (input: string, confirmInput: string, msgErr?: string): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const inputVal: string = control.get(input)?.value || '';
  const confirmInputVal: string = control.get(confirmInput)?.value || '';

  const errInputVal = control.get(input)?.errors;
  const errConfirmInputVal = control.get(confirmInput)?.errors;

  if (!inputVal || !confirmInputVal || errInputVal || errConfirmInputVal) {
    return null;
  } else {
    if (inputVal === confirmInputVal){
      return { notAllowMath: true, message: msgErr || 'Mật khẩu mới không được trùng với mật khẩu cũ' };
    } else {
      return null
    }
  }
}


export function messageValidator(
  validatorFn: ValidatorFn,
  message?: string
): ValidatorFn {
  if (!message) return validatorFn;
  return (control: AbstractControl): ValidationErrors | null => {
    const error = validatorFn(control);
    if (error) {
      error['message'] = message;
    }
    return error;
  };
}

export function minValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
      return null; // don't validate empty values to allow optional controls
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value < min
      ? { min: { min: min, actual: control.value } }
      : null;
  };
}

export function minValidatorLess(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
      return null; // don't validate empty values to allow optional controls
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value <= min
      ? { min: { min: min, actual: control.value } }
      : null;
  };
}

export function maxValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
      return null; // don't validate empty values to allow optional controls
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value > max
      ? { max: { max: max, actual: control.value } }
      : null;
  };
}



export function requiredValidator(
  control: AbstractControl
): ValidationErrors | null {
  return isEmptyInputValue(control.value) ? { required: true } : null;
}

export function requiredTrueValidator(
  control: AbstractControl
): ValidationErrors | null {
  return control.value === true ? null : { required: true };
}

export function requiredQtyValidator(
  control: AbstractControl
): ValidationErrors | null {
  return control.value > 0 ? null : { required: true };
}

export function emailValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (isEmptyInputValue(control.value)) {
    return null; // don't validate empty values to allow optional controls
  }
  return EMAIL_REGEX.test(control.value) ? null : { email: true };
}

export function phoneValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (isEmptyInputValue(control.value)) {
    return null; // don't validate empty values to allow optional controls
  }
  return PHONE_REGEX_VALIDATE.test(control.value) ? null : { phone: true };
}

export function dateValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (isEmptyInputValue(control.value)) {
    return null;
  }
  return DATE_REGEX.test(control.value) ? null : { date: true };
}

export function characterValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (isEmptyInputValue(control.value)) {
    return null; // don't validate empty values to allow optional controls
  }
  return EXCLUDE_SPECIAL_CHARACTERS.test(control.value)
    ? null
    : { character: true };
}

export function identityValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (isEmptyInputValue(control.value)) {
    return null; // don't validate empty values to allow optional controls
  }
  return IDENTITY_CARD_REGEX.test(control.value)
    ? null
    : { identityCard: true };
}

export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (isEmptyInputValue(value) || !hasValidLength(value)) {
      return null;
    }
    return value.length < minLength
      ? {
          minlength: {
            requiredLength: minLength,
            actualLength: value.length
          }
        }
      : null;
  };
}

export function expiresValidator(isExpired: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return isExpired !== true ? null : { insuranceCardIsExpires: true };
  };
}

export function insuranceToDateIllegalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return { insuranceToDateIllegal: true };
  };
}

export function isVietnameseValidator(isNotVietnamese: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return isNotVietnamese == true ? null : { isNotVietnamese: true };
  };
}

export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;
    if (typeof value === 'number') {
      value = value.toString();
    }
    return hasValidLength(value) && value.length > maxLength
      ? {
          maxLength: {
            requiredLength: maxLength,
            actualLength: value.length
          }
        }
      : null;
  };
}

function getStringByteLength(str: string) {
  str = typeof(str) === 'string' ? str : '';
  const byteSize = new Blob([str]).size;
  return byteSize;
}
export function maxLengthUnicodeValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;
    if (typeof value === 'number') {
      value = value.toString();
    }

    // Calculate the actual length by byte
    const byteLength = getStringByteLength(value);

    return hasValidLength(value) && byteLength > maxLength
      ? {
        maxLengthUnicode: {
          requiredLength: maxLength,
          actualLength: value.length
        }
      }
      : null;
  };
}

export function patternAllowValidator(pattern: string | RegExp): ValidatorFn {
  if (!pattern) return nullValidator;
  let regex: RegExp;
  let regexStr: string;
  if (typeof pattern === 'string') {
    regexStr = '';

    if (pattern.charAt(0) !== '^') regexStr += '^';

    regexStr += pattern;

    if (pattern.charAt(pattern.length - 1) !== '$') regexStr += '$';

    regex = new RegExp(regexStr);
  } else {
    regexStr = pattern.toString();
    regex = pattern;
  }
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }
    const value: string = control.value;
    return regex.test(value)
      ? null
      : { pattern: { requiredPattern: regexStr, actualValue: value } };
  };
}

export function patternRejectValidator(pattern: string | RegExp): ValidatorFn {
  if (!pattern) return nullValidator;
  let regex: RegExp;
  let regexStr: string;
  if (typeof pattern === 'string') {
    regexStr = '';

    if (pattern.charAt(0) !== '^') regexStr += '^';

    regexStr += pattern;

    if (pattern.charAt(pattern.length - 1) !== '$') regexStr += '$';

    regex = new RegExp(regexStr);
  } else {
    regexStr = pattern.toString();
    regex = pattern;
  }
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }
    const value: string = control.value;
    return regex.test(value)
      ? { patternReject: { includesRejectChar: regexStr, actualValue: value } }
      : null;
  };
}

export function nullValidator(
  control: AbstractControl
): ValidationErrors | null {
  return null;
}

function isPresent(o: any): boolean {
  return o != null;
}

// export function toObservable(r: any): Observable<any> {
//   const obs = isPromise(r) ? from(r) : r;
//   if (!isObservable(obs)) {
//     throw new Error(`Expected validator to return Promise or Observable.`);
//   }
//   return obs;
// }

function mergeErrors(
  arrayOfErrors: (ValidationErrors | null)[]
): ValidationErrors | null {
  let res: { [key: string]: any } = {};
  arrayOfErrors.forEach((errors: ValidationErrors | null) => {
    res = errors != null ? { ...res!, ...errors } : res!;
  });

  return Object.keys(res).length === 0 ? null : res;
}

type GenericValidatorFn = (control: AbstractControl) => any;

function executeValidators<V extends GenericValidatorFn>(
  control: AbstractControl,
  validators: V[]
): ReturnType<V>[] {
  return validators.map((validator) => validator(control));
}

function compose(
  validators: (ValidatorFn | null | undefined)[] | null
): ValidatorFn | null {
  if (!validators) return null;
  const presentValidators: ValidatorFn[] = validators.filter(isPresent) as any;
  if (presentValidators.length == 0) return null;

  return function (control: AbstractControl) {
    return mergeErrors(
      executeValidators<ValidatorFn>(control, presentValidators)
    );
  };
}

// function composeAsync(
//   validators: (AsyncValidatorFn | null)[]
// ): AsyncValidatorFn | null {
//   if (!validators) return null;
//   const presentValidators: AsyncValidatorFn[] = validators.filter(
//     isPresent
//   ) as any;
//   if (presentValidators.length == 0) return null;
//
//   return function (control: AbstractControl) {
//     const observables = executeValidators<AsyncValidatorFn>(
//       control,
//       presentValidators
//     ).map(toObservable);
//     return forkJoin(observables).pipe(map(mergeErrors));
//   };
// }
