
declare module 'combine-dependant-reducers' {
    type Reducer<S = any, A extends Action = AnyAction> = (
        state: S | undefined,
        action: A
    ) => S;

    type DependantReducersMapObject<S = any, A extends Action = Action> = {
      [K in keyof S]: Reducer<S[K], A> | [Reducer<S[K], A>, string]
    }

    declare function combineDependantReducers<S>(
        reducers: DependantReducersMapObject<S, any>
    ): Reducer<S>

    export default combineDependantReducers;    
}
