import { PasswordsState } from "./state";
import { Action } from "redux";

export enum PasswordsAction {
    DATABASE_LOADED = 'DATABASE_LOADED'
}
export const databaseLoaded = (db: PasswordsState | null) => ({
    type: PasswordsAction.DATABASE_LOADED,
    db
});

const reducer = (state: PasswordsState, action: Action) => state || null;
export default reducer;