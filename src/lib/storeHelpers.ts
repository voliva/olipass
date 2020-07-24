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

type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never;
export interface Action {
  type: symbol;
}

export type ActionCreator<T extends Array<any>, A extends Action> = ((
  ...args: T
) => A) & {
  actionType: symbol;
  isCreatorOf: (action: Action) => action is A;
};
export function createActionCreator<TFn extends (...args: any[]) => any>(
  s: string,
  fn: TFn = (() => {}) as any
) {
  const type = Symbol(s);

  const actionCreator = (...args: ArgumentTypes<TFn>) => ({
    type,
    ...fn!(...args),
  });

  type SpecificAction = Action & ReturnType<TFn>;
  const ret: ActionCreator<ArgumentTypes<TFn>, SpecificAction> = Object.assign(
    actionCreator,
    {
      actionType: type,
      isCreatorOf: (action: Action): action is SpecificAction => {
        return action.type === type;
      },
    }
  );
  return ret;
}

export const createStandardAction = <TPayload = undefined>(name: string) => {
  type PayloadFn = TPayload extends undefined
    ? () => {}
    : (payload: TPayload) => { payload: TPayload };
  return createActionCreator(name, ((payload: TPayload) => ({
    payload,
  })) as PayloadFn);
};
