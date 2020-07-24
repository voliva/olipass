import { Subject, Observable } from "rxjs";
import { useCallback, useEffect, useMemo } from "react";
import { tap } from "rxjs/operators";

export const useAction = <T>(subject: Subject<T>) =>
  useCallback((action: T) => subject.next(action), [subject]);

export const useObservableEffect = (effect$: Observable<any>) =>
  useEffect(() => {
    const subscription = effect$.subscribe();
    return () => subscription.unsubscribe();
  }, [effect$]);

export const useObservableActions = <T>(
  observable: Observable<T>,
  handler: (action: T) => void
) =>
  useObservableEffect(
    useMemo(() => observable.pipe(tap(handler)), [observable, handler])
  );
