import { Action } from "redux";

type ActionWithPayload<T, P> = Action<T> & {
    payload: P
}

export function createAction<T>(type: T): Action<T>;
export function createAction<T, P>(type: T, payload: P): ActionWithPayload<T, P>;
export function createAction<T, P>(type: T, payload?: P) {
    return {
        type,
        payload
    }
}