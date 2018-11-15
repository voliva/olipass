import { PasswordsState } from "./state";
import rereducer, { payload } from 'rereducer';
import { createAction } from "redux-actions";

export enum PasswordsAction {
    DBLoaded = 'DBLoaded'
}

export const dbLoaded = createAction(PasswordsAction.DBLoaded, (db: PasswordsState | null) => ({db}));

const reducer = rereducer(
    null,
    [PasswordsAction.DBLoaded, payload('db')]
);
export default reducer;
