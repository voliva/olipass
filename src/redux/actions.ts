import { Action } from "redux";

export type ActionWithPayload<P = any, T = any> = Action<T> & {
    payload: P
}

export function createAction<T>(type: T): Action<T>;
export function createAction<T, P>(type: T, payload: P): ActionWithPayload<P, T>;
export function createAction<T, P>(type: T, payload?: P) {
    return {
        type,
        payload
    }
}