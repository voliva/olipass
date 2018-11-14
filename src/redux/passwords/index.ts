import { PasswordsState } from "./state";
import rereducer, { payload } from 'rereducer';
import { createAction } from "redux-actions";

export enum PasswordsAction {
    CreateNewDB = 'CreateNewDB',
    DBLoaded = 'DBLoaded'
}

export const createNewDB = createAction(PasswordsAction.CreateNewDB, (password: string) => ({password}));
export const dbLoaded = createAction(PasswordsAction.DBLoaded, (db: PasswordsState | null) => ({db}) );

const reducer = rereducer(
    null,
    [PasswordsAction.DBLoaded, payload('db')]
);
export default reducer;
