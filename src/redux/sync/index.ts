import { createAction } from "../actions";
import { PasswordDB } from "./state";

export enum SyncAction {
    DBLoaded = 'DBLoaded'
}

export const dbLoaded = (db: PasswordDB | null, password: string) => createAction(SyncAction.DBLoaded, {db, password});
