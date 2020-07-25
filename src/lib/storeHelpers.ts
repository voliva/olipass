import { useSubscribe } from "@react-rxjs/utils";
import { useCallback, useMemo } from "react";
import {
  Observable,
  Subject,
  SchedulerLike,
  asapScheduler,
  MonoTypeOperatorFunction,
} from "rxjs";
import { tap, observeOn, share } from "rxjs/operators";
import { createLink, addDebugTag } from "rxjs-traces";

export const useAction = <T>(subject: Subject<T>) =>
  useCallback((action: T) => subject.next(action), [subject]);

export const useObservableEffect = <T>(
  observable: Observable<T>,
  handler: (action: T) => void
) =>
  useSubscribe(
    useMemo(
      () =>
        observable.pipe(
          (stream) =>
            new Observable<T>((obs) => {
              let isSync = true;
              const subscription = stream.subscribe(
                (next) => {
                  if (isSync) return;
                  obs.next(next);
                },
                obs.error.bind(obs),
                obs.complete.bind(obs)
              );
              isSync = false;
              return subscription;
            }),
          tap(handler)
        ),
      [observable, handler]
    )
  );

export const recursiveObservable = <T>(
  scheduler: SchedulerLike = asapScheduler
): [Observable<T>, () => MonoTypeOperatorFunction<T>] => {
  const [from, to] = createLink();
  const mirrored$ = new Subject<T>();
  return [
    mirrored$.pipe(observeOn(scheduler), to(), share()),
    () => (source: Observable<T>) => source.pipe(tap(mirrored$), from()) as any,
  ];
};
