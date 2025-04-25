import { isEqual } from 'lodash';
import {combineLatest, MonoTypeOperatorFunction, Observable} from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

export function combineLatestWithFilter<T extends Observable<any>[]>(
  ...sources: T
): Observable<{ [K in keyof T]: T[K] extends Observable<infer U> ? U : never }> {
  return new Observable<{ [K in keyof T]: T[K] extends Observable<infer U> ? U : never }>((subscriber) => {
    combineLatest(sources)
      .pipe(
        filter((values) => values.every((val) => !!val)),

        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe({
        next: (value) => {
          subscriber.next(value as { [K in keyof T]: T[K] extends Observable<infer U> ? U : never });
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
  });
}




export function distinctUntilDeepChanged<T>(): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged<T>((prev, curr) => isEqual(prev, curr));
}
