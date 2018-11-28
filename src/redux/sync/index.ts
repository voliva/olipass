import { createAction } from "../actions";
import { PasswordDB } from "./state";

export enum SyncAction {
    DBLoaded = 'DBLoaded'
}

export const dbLoaded = (db: PasswordDB | null) => createAction(SyncAction.DBLoaded, {db});
