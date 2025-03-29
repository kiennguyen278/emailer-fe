import { ErrorHandler } from '@angular/core';
import { InvalidFormError } from "@core/utils/form.util";

export class MyErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }
    if (error instanceof InvalidFormError) {
    } else {
      error && console.error('error MyErrorHandler', error);
    }
  }
}
